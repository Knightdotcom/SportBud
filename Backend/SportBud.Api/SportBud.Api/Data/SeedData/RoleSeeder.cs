using SportBud.Api.Data.Constants;
using Microsoft.AspNetCore.Identity;

namespace SportBud.Api.Data.SeedData
{
    // Skapar de nödvändiga rollerna i databasen vid uppstart om de inte redan finns
    public class RoleSeeder
    {
        // Skapar Admin- och User-rollerna om de saknas i databasen
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Skapar Admin-rollen om den inte redan finns
            if (!await roleManager.RoleExistsAsync(Roles.Admin))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.Admin));
            }

            // Skapar User-rollen om den inte redan finns
            if (!await roleManager.RoleExistsAsync(Roles.User))
            {
                await roleManager.CreateAsync(new IdentityRole(Roles.User));
            }
        }
    }
}
