using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SportBud.Api.Data.Entities
{
    // Representerar en användare i systemet, ärver från IdentityUser för inbyggd autentisering
    public class AppUser : IdentityUser
    {
        // Användarens förnamn, obligatoriskt fält
        [Required]
        public string FirstName { get; set; } = string.Empty;

        // Användarens efternamn, obligatoriskt fält
        [Required]
        public string LastName { get; set; } = string.Empty;

        // Anger om användarkontot är aktivt eller inaktiverat av admin
        public bool IsActiveUser { get; set; }

        // Lista med alla bud som användaren har lagt
        public List<Bid> Bids { get; set; } = new();

        // Lista med alla auktioner som användaren har skapat
        public List<Auction> Auctions { get; set; } = new();
    }
}
