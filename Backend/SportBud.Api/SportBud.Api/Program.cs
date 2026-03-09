using SportBud.Api.Data.SeedData;
using SportBud.Api.Extensions;

namespace SportBud.Api
{
    // Applikationens startpunkt som konfigurerar och startar webservern
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Registrerar alla tjänster i dependency injection-containern
            builder.Services.AddDbContextExtension(builder);
            builder.Services.AddJwtAuth(builder);
            builder.Services.AddScopedServices();
            builder.Services.AddAutoMapper(typeof(Program));
            builder.Services.AddIdentityExtension();
            builder.Services.AddControllers();
            builder.Services.AddSwaggerServices();
            builder.Services.AddCors();

            var app = builder.Build();

            // Tillåter anrop från alla origins, headers och metoder (för frontend-kommunikation)
            app.UseCors(builder =>
                builder.AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowAnyOrigin());

            // Aktiverar Swagger UI bara i utvecklingsmiljön
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Skapar roller och testanvändare i databasen vid uppstart om de inte finns
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                RoleSeeder.SeedRolesAsync(services).Wait();
                UserSeeder.SeedUsersAsync(services).Wait();
            }

            app.UseRouting();

            // Aktiverar autentisering och auktorisering för att skydda endpoints
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();
            app.MapControllers();
            app.Run();
        }
    }
}

