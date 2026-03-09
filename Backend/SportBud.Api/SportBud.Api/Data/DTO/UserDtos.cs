namespace SportBud.Api.Data.DTO
{
    // DTO för att ta emot data vid registrering av ny användare
    // IsAdmin är false som standard, vilket innebär att nya användare registreras som vanliga användare
    public class RegisterUserDto
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsAdmin { get; set; } = false;
    }

    // DTO för svar efter att en användare har registrerats
    public class CreateUserResponseDto
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public IEnumerable<string>? Roles { get; set; }
    }

    // DTO för att ta emot inloggningsuppgifter
    // Tillåter inloggning med antingen användarnamn eller e-postadress
    public class LoginDto
    {
        public string UserNameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // DTO för svar efter lyckad inloggning, innehåller JWT-token och aktivitetsstatus
    public class LoginResponseDto
    {
        public string? Token { get; set; }
        public bool IsActive { get; set; }
    }

    // DTO för att hämta grundläggande användarinformation
    public class GetUserDto
    {
        public string? UserId { get; set; }
        public bool IsActive { get; set; }
    }

    // DTO för att validera och hämta användarinformation inklusive roller
    public class GetUserValidationDto
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public IEnumerable<string> Roles { get; set; } = new List<string>();
    }

    // DTO för att visa användarlista i admin-panelen
    public class GetUsersDto
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    // DTO för att uppdatera en användares aktiva status (aktivera/inaktivera)
    public class UpdateStatusUserDto
    {
        public bool IsActive { get; set; }
    }

    // DTO för att uppdatera en användares lösenord
    public class UpdateUserPasswordDto
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
