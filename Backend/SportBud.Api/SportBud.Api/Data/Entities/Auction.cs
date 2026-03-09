using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SportBud.Api.Data.Entities
{
    // Representerar en auktion i systemet med alla dess egenskaper
    public class Auction
    {
        // Unikt id för auktionen, används som primärnyckel i databasen
        [Key]
        public int AuctionId { get; set; }

        // Auktionens titel, obligatoriskt fält
        [Required]
        public string Title { get; set; } = string.Empty;

        // Beskrivning av varan som säljs, obligatoriskt fält
        [Required]
        public string Description { get; set; } = string.Empty;

        // Startpris för auktionen, måste vara minst 0.01, lagras med 2 decimalers precision
        [Required]
        [Precision(18, 2)]
        [Range(0.01, double.MaxValue)]
        public decimal StartPrice { get; set; }

        // Valfri URL till en bild på varan
        public string? ImageUrl { get; set; }

        // Datum och tid när auktionen startar (UTC)
        public DateTime StartAtUtc { get; set; }

        // Datum och tid när auktionen avslutas (UTC), obligatoriskt fält
        [Required]
        public DateTime EndAtUtc { get; set; }

        // Beräknad egenskap som returnerar true om auktionen fortfarande är öppen
        public bool IsOpen => DateTime.UtcNow < EndAtUtc;

        // Anger om auktionen har inaktiverats av en admin
        public bool IsDeactivatedByAdmin { get; set; } = false;

        // Id för den användare som skapat auktionen, koppling till AppUser
        public string UserId { get; set; } = string.Empty;
        public AppUser? User { get; set; }

        // Lista med alla bud som lagts på auktionen
        public List<Bid> Bids { get; set; } = new();
    }
}
