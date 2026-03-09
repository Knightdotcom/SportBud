using SportBud.Api.Data.Constants;
using SportBud.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace SportBud.Api.Data.SeedData
{
    // Skapar testanvändare i databasen vid uppstart om de inte redan finns
    public static class UserSeeder
    {
        // Skapar en admin och fyra vanliga testanvändare med sina uppgifter
        public static async Task SeedUsersAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            await CreateUserWithRole(userManager, "Erik", "Lindqvist", "admin", "admin@sportbud.se", "admin1", Roles.Admin);
            await CreateUserWithRole(userManager, "Sofia", "Bergström", "sofia_b", "sofia@sportbud.se", "sportUser", Roles.User);
            await CreateUserWithRole(userManager, "Marcus", "Holm", "marcus_h", "marcus@sportbud.se", "sportUser", Roles.User);
            await CreateUserWithRole(userManager, "Lena", "Persson", "lena_p", "lena@sportbud.se", "sportUser", Roles.User);
            await CreateUserWithRole(userManager, "Johan", "Ekström", "johan_e", "johan@sportbud.se", "sportUser", Roles.User);
        }

        // Hjälpmetod som skapar en enskild användare och tilldelar den en roll
        // Skapar bara användaren om e-postadressen inte redan finns i databasen
        private static async Task CreateUserWithRole(
            UserManager<AppUser> userManager,
            string firstName,
            string lastName,
            string userName,
            string email,
            string password,
            string role)
        {
            if (await userManager.FindByEmailAsync(email) == null)
            {
                var newUser = new AppUser
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    EmailConfirmed = true,
                    UserName = userName,
                    IsActiveUser = true
                };

                var result = await userManager.CreateAsync(newUser, password);

                // Tilldelar rollen om användaren skapades utan fel, annars kastas ett undantag
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser, role);
                }
                else
                {
                    var errors = string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}"));
                    throw new Exception($"Failed creating user {email}: {errors}");
                }
            }
        }
    }
}
