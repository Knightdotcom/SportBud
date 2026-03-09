using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SportBud.Api.Data.Entities
{
    // Representerar ett bud som en användare lägger på en auktion
    public class Bid
    {
        // Unikt id för budet, används som primärnyckel i databasen
        [Key]
        public int Id { get; set; }

        // Tidpunkt när budet lades (UTC), sätts automatiskt till nuvarande tid
        [Required]
        public DateTime BidTimeUtc { get; set; } = DateTime.UtcNow;

        // Budets belopp, måste vara minst 0.01, lagras med 2 decimalers precision
        [Required]
        [Precision(18, 2)]
        [Range(0.01, double.MaxValue)]
        public decimal BidAmount { get; set; }

        // Id och navigeringsegenskap för användaren som lade budet
        public string UserId { get; set; } = string.Empty;
        public AppUser? User { get; set; }

        // Id och navigeringsegenskap för auktionen som budet tillhör
        public int AuctionId { get; set; }
        public Auction? Auction { get; set; }
    }
}
