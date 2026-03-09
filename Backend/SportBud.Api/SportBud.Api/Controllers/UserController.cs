using SportBud.Api.Core.Interfaces;
using SportBud.Api.Data.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SportBud.Api.Controllers
{
    // Hanterar alla HTTP-anrop relaterade till användare och autentisering
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        // Konstruktor som tar emot användarservice via dependency injection
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [SwaggerOperation(Summary = "Registrerar en ny användare")]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
            var result = await _userService.AddAsync(dto);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result);
        }

        [SwaggerOperation(Summary = "Loggar in och returnerar JWT-token")]
        [HttpPost]
        [Route("/login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _userService.LoginAsync(dto);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result);
        }

        [SwaggerOperation(Summary = "Söker bland användare baserat på sökord (kräver Admin-roll)")]
        [Authorize(Roles = "Admin")]
        [Route("/allUsers/search")]
        [HttpGet]
        public async Task<IActionResult> GetUsersSearch(string search)
        {
            var result = await _userService.GetAll(search);
            return Ok(result.Data);
        }

        // Hämtar användaruppgifter - kontrollerar att användaren bara kan hämta sina egna uppgifter
        [SwaggerOperation(Summary = "Hämtar den inloggade användarens uppgifter (kräver inloggning)")]
        [Authorize]
        [HttpGet("/user/{userId}")]
        public async Task<IActionResult> GetUserValidation(string userId)
        {
            var userIdFromToken = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdFromToken is null || userId != userIdFromToken) return Unauthorized();

            var result = await _userService.GetUserByIdDto(userId);
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Hämtar alla användare (kräver Admin-roll)")]
        [Authorize(Roles = "Admin")]
        [Route("/allUsers")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var result = await _userService.GetAll();
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Aktiverar eller avaktiverar en användare (kräver Admin-roll)")]
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeActivateUser(UpdateStatusUserDto dto, string userId)
        {
            var result = await _userService.DeActivateUser(dto, userId);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result.Error);
        }

        [SwaggerOperation(Summary = "Uppdaterar den inloggade användarens lösenord (kräver inloggning)")]
        [HttpPut]
        [Authorize]
        [Route("/user/update")]
        public async Task<IActionResult> UpdatePassword(UpdateUserPasswordDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var result = await _userService.UpdateUserPassword(dto, userId);
            return Ok(result.Data);
        }
    }
}
