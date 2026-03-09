using SportBud.Api.Core.Interfaces;
using SportBud.Api.Core.Services;
using SportBud.Api.Data;
using SportBud.Api.Data.Entities;
using SportBud.Api.Data.Interfaces;
using SportBud.Api.Data.Repos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace SportBud.Api.Extensions
{
    // Samling av extension-metoder för att registrera tjänster i dependency injection-containern
    public static class ServiceExtensions
    {
        // Konfigurerar Swagger med stöd för JWT-autentisering direkt i Swagger UI
        public static IServiceCollection AddSwaggerServices(this IServiceCollection services)
        {
            services.AddSwaggerGen(opt =>
            {
                opt.EnableAnnotations();

                opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Klistra in JWT-token här:"
                });

                opt.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new List<string>()
                    }
                });
            });

            return services;
        }

        // Registrerar alla services och repositories med Scoped livstid i DI-containern
        public static IServiceCollection AddScopedServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IBidService, BidService>();
            services.AddScoped<IAuctionService, AuctionService>();
            services.AddScoped<IBidRepo, BidRepo>();
            services.AddScoped<IAuctionRepo, AuctionRepo>();
            return services;
        }

        // Konfigurerar JWT-autentisering med validering av issuer, audience, livstid och signeringsnyckel
        public static IServiceCollection AddJwtAuth(this IServiceCollection services, WebApplicationBuilder builder)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
                    ValidAudience = builder.Configuration["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]!))
                };
            });

            return services;
        }

        // Konfigurerar ASP.NET Identity med enkla lösenordskrav och tillåter svenska tecken i användarnamn
        public static IServiceCollection AddIdentityExtension(this IServiceCollection services)
        {
            services.AddIdentityCore<AppUser>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                // Tillåter svenska tecken (å, ä, ö) i användarnamn
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@åäöÅÄÖ";
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();

            return services;
        }

        // Konfigurerar databasanslutningen med SQL Server via connection string från appsettings
        public static IServiceCollection AddDbContextExtension(this IServiceCollection services, WebApplicationBuilder builder)
        {
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString));

            return services;
        }
    }
}
