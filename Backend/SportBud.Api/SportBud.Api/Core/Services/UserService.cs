using SportBud.Api.Core.Interfaces;
using SportBud.Api.Data.Constants;
using SportBud.Api.Data.DTO;
using SportBud.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SportBud.Api.Core.Services
{
    // Innehåller affärslogiken för användare och autentisering, implementerar IUserService
    public class UserService : IUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;

        // Konstruktor som tar emot UserManager och konfiguration via dependency injection
        public UserService(UserManager<AppUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        // Registrerar en ny användare och tilldelar rätt roll baserat på IsAdmin-flaggan
        public async Task<Result<CreateUserResponseDto>> AddAsync(RegisterUserDto dto)
        {
            var entity = new AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                FirstName = dto.FirstName ?? string.Empty,
                LastName = dto.LastName ?? string.Empty,
                IsActiveUser = true
            };

            var result = await _userManager.CreateAsync(entity, dto.Password ?? string.Empty);

            if (!result.Succeeded)
                return Result<CreateUserResponseDto>.Fail(ErrorMessages.UserCredentialsMissing);

            var addRole = dto.IsAdmin
                ? await _userManager.AddToRolesAsync(entity, new List<string> { Roles.Admin, Roles.User })
                : await _userManager.AddToRoleAsync(entity, Roles.User);

            if (!addRole.Succeeded)
                return Result<CreateUserResponseDto>.Fail(ErrorMessages.FailedAddingRole);

            var roles = await _userManager.GetRolesAsync(entity);

            var resDto = new CreateUserResponseDto
            {
                Id = entity.Id,
                Email = entity.Email,
                UserName = entity.UserName,
                Roles = roles
            };

            return Result<CreateUserResponseDto>.Ok(resDto);
        }

        // Hämtar alla roller som en användare tillhör
        public async Task<IEnumerable<string>> GetUserRoles(AppUser user)
        {
            return await _userManager.GetRolesAsync(user);
        }

        // Genererar ett JWT-token med användarens id, namn, e-post och roller som claims
        // Token är giltig i 1 timme och signeras med den hemliga nyckeln från konfigurationen
        public async Task<string> GenerateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
            };

            var userRoles = await GetUserRoles(user);
            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            var secretKey = _config["JwtSettings:Key"];
            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Loggar in en användare - söker med e-post om "@" finns i input, annars med användarnamn
        // Kontrollerar att kontot är aktivt och att lösenordet stämmer, returnerar JWT-token
        public async Task<Result<LoginResponseDto>> LoginAsync(LoginDto dto)
        {
            var userEntity = dto.UserNameOrEmail.Contains("@")
                ? await _userManager.FindByEmailAsync(dto.UserNameOrEmail)
                : await _userManager.FindByNameAsync(dto.UserNameOrEmail);

            if (userEntity is null)
                return Result<LoginResponseDto>.Fail(ErrorMessages.UserNotFound);

            if (!userEntity.IsActiveUser)
                return Result<LoginResponseDto>.Fail(ErrorMessages.DeActivatedByAdmin);

            var result = await _userManager.CheckPasswordAsync(userEntity, dto.Password);

            if (!result)
                return Result<LoginResponseDto>.Fail(ErrorMessages.WrongPassword);

            var token = await GenerateToken(userEntity);

            return Result<LoginResponseDto>.Ok(new LoginResponseDto { Token = token, IsActive = userEntity.IsActiveUser });
        }

        // Hämtar en användare som AppUser-objekt baserat på id
        public async Task<AppUser?> GetUserById(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        // Hämtar alla användare och mappar dem till DTO-format
        public async Task<Result<List<GetUsersDto>>> GetAll()
        {
            var result = await _userManager.Users.ToListAsync();

            var dto = result.Select(u => new GetUsersDto
            {
                UserId = u.Id,
                UserName = u.UserName ?? string.Empty,
                UserEmail = u.Email ?? string.Empty,
                IsActive = u.IsActiveUser
            }).ToList();

            return Result<List<GetUsersDto>>.Ok(dto);
        }

        // Hämtar användare filtrerade på användarnamn
        public async Task<Result<List<GetUsersDto>>> GetAll(string search)
        {
            var result = await _userManager.Users
                .Where(u => u.UserName!.ToLower().Contains(search.ToLower()))
                .ToListAsync();

            var dto = result.Select(u => new GetUsersDto
            {
                UserId = u.Id,
                UserName = u.UserName ?? string.Empty,
                UserEmail = u.Email ?? string.Empty,
                IsActive = u.IsActiveUser
            }).ToList();

            return Result<List<GetUsersDto>>.Ok(dto);
        }

        // Admin-metod för att aktivera eller inaktivera ett användarkonto
        public async Task<Result<GetUserDto>> DeActivateUser(UpdateStatusUserDto dto, string userId)
        {
            var user = await GetUserById(userId);

            if (user is null)
                return Result<GetUserDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            user.IsActiveUser = dto.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return Result<GetUserDto>.Fail(ErrorMessages.FailSaveAsync);

            return Result<GetUserDto>.Ok(new GetUserDto { UserId = user.Id, IsActive = dto.IsActive });
        }

        // Hämtar en användare som DTO med rollsinformation baserat på id
        public async Task<Result<GetUserValidationDto>> GetUserByIdDto(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user is null)
                return Result<GetUserValidationDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            var roles = await GetUserRoles(user);

            return Result<GetUserValidationDto>.Ok(new GetUserValidationDto
            {
                UserId = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Roles = roles
            });
        }

        // Uppdaterar en användares lösenord och returnerar ett nytt JWT-token vid lyckat byte
        public async Task<Result<LoginResponseDto>> UpdateUserPassword(UpdateUserPasswordDto dto, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user is null)
                return Result<LoginResponseDto>.Fail(ErrorMessages.UserNotFound);

            if (dto.OldPassword is null || dto.NewPassword is null)
                return Result<LoginResponseDto>.Fail(ErrorMessages.WrongPassword);

            var result = await _userManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);

            if (!result.Succeeded)
                return Result<LoginResponseDto>.Fail(ErrorMessages.UpdateFailed);

            var token = await GenerateToken(user);

            return Result<LoginResponseDto>.Ok(new LoginResponseDto { IsActive = user.IsActiveUser, Token = token });
        }
    }
}
