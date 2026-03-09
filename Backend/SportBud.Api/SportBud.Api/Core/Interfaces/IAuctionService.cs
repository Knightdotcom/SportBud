using SportBud.Api.Core.Services;
using SportBud.Api.Data.DTO;

namespace SportBud.Api.Core.Interfaces
{
    // Interface som definierar all affärslogik för auktioner
    public interface IAuctionService
    {
        // Skapar en ny auktion för den angivna användaren
        Task<Result<CreateAuctionResponeDto?>> AddAsync(CreateAuctionDto dto, string userId);

        // Uppdaterar en befintlig auktion, kontrollerar att användaren äger auktionen
        Task<Result<UpdateAuctionResponseDto>> UpdateAsync(UpdateAuctionDto dto, int auctionId, string userId);

        // Hämtar alla auktioner med möjlighet att söka på titel
        Task<Result<List<AuctionsGetResponseDto>>> GetAllAsync(string search);

        // Hämtar alla auktioner utan filtrering
        Task<Result<List<AuctionsGetResponseDto>>> GetAllAsync();

        // Hämtar alla auktioner som fortfarande är öppna
        Task<Result<List<AuctionsGetResponseDto>>> GetAllOpenAsync();

        // Hämtar alla öppna auktioner med möjlighet att söka på titel
        Task<Result<List<AuctionsGetResponseDto>>> GetAllOpenAsync(string search);

        // Admin-metod för att aktivera eller inaktivera en auktion
        Task<Result<UpdateAuctionResponseDto>> DeActivateAuction(AdminDeactivateAuctionDto dto, int auctionId);

        // Hämtar en specifik auktion baserat på dess id
        Task<Result<AuctionsGetResponseDto>> GetById(int auctionId);
    }
}
