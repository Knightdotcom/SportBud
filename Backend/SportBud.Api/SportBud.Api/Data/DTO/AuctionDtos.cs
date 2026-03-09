using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SportBud.Api.Data.DTO
{
    // DTO för att skicka auktionsdata till klienten vid hämtning
    public class AuctionsGetResponseDto
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }

        [Precision(18, 2)]
        [Range(0.01, double.MaxValue)]
        public decimal StartPrice { get; set; }

        // Det högsta budet på auktionen, kan vara null om inga bud har lagts
        public BidsGetDto? HighestBid { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsOpen { get; set; }
        public DateTime StartDateUtc { get; set; }
        public DateTime EndDateUtc { get; set; }
        public bool IsDeactivatedByAdmin { get; set; }
    }

    // DTO för svar efter att en auktion har skapats
    public class CreateAuctionResponeDto
    {
        public int AuctionId { get; set; }
        public string? UserId { get; set; }
        public bool IsOpen { get; set; }
    }

    // DTO för att ta emot data när en ny auktion skapas
    // Titeln får vara max 60 och min 2 tecken, startpris måste vara minst 0.01
    public class CreateAuctionDto
    {
        [StringLength(60, MinimumLength = 2)]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        [Precision(18, 2)]
        [Range(0.01, double.MaxValue)]
        public decimal StartPrice { get; set; }

        // Starttid sätts till nu och sluttid sätts automatiskt till 7 dagar framåt som standard
        public DateTime StartAtUtc { get; set; } = DateTime.Now;
        public DateTime EndAtUtc { get; set; } = DateTime.Now.AddDays(7);
    }

    // DTO för att uppdatera en befintlig auktion, alla fält är valfria
    public class UpdateAuctionDto
    {
        [StringLength(60, MinimumLength = 2)]
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public decimal? StartPrice { get; set; }
        public DateTime? newEndDateUtc { get; set; }
    }

    // DTO för admin-åtgärden att aktivera eller inaktivera en auktion
    public class AdminDeactivateAuctionDto
    {
        public bool IsDeactivatedByAdmin { get; set; }
    }

    // DTO för svar efter att en auktion har uppdaterats
    public class UpdateAuctionResponseDto
    {
        public string? Title { get; set; }
        public string? UserName { get; set; }
        public string? Description { get; set; }
        public bool IsOpen { get; set; }
        public decimal StartPrice { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsDeactivatedByAdmin { get; set; }
    }
}
