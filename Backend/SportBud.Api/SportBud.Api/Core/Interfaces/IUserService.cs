using SportBud.Api.Core.Services;
using SportBud.Api.Data.DTO;
using SportBud.Api.Data.Entities;

namespace SportBud.Api.Core.Interfaces
{
    // Interface som definierar all affärslogik för användare och autentisering
    public interface IUserService
    {
        // Registrerar en ny användare i systemet
        Task<Result<CreateUserResponseDto>> AddAsync(RegisterUserDto dto);

        // Loggar in en användare och returnerar ett JWT-token
        Task<Result<LoginResponseDto>> LoginAsync(LoginDto dto);

        // Hämtar en användare som AppUser-objekt baserat på id
        Task<AppUser?> GetUserById(string id);

        // Hämtar en användare som DTO baserat på id, med rollsinformation
        Task<Result<GetUserValidationDto>> GetUserByIdDto(string id);

        // Hämtar alla användare utan filtrering
        Task<Result<List<GetUsersDto>>> GetAll();

        // Hämtar alla användare med möjlighet att söka
        Task<Result<List<GetUsersDto>>> GetAll(string search);

        // Genererar ett JWT-token för den angivna användaren
        Task<string> GenerateToken(AppUser user);

        // Hämtar alla roller som en användare tillhör
        Task<IEnumerable<string>> GetUserRoles(AppUser user);

        // Admin-metod för att aktivera eller inaktivera ett användarkonto
        Task<Result<GetUserDto>> DeActivateUser(UpdateStatusUserDto dto, string userId);

        // Uppdaterar en användares lösenord efter att det gamla lösenordet validerats
        Task<Result<LoginResponseDto>> UpdateUserPassword(UpdateUserPasswordDto dto, string userId);
    }
}
