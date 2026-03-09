using SportBud.Api.Core.Services;
using SportBud.Api.Data.DTO;

namespace SportBud.Api.Core.Interfaces
{
    // Interface som definierar all affärslogik för bud
    public interface IBidService
    {
        // Lägger ett nytt bud på en auktion, med validering av beloppet
        Task<Result<AddBidResponseDto>> AddBidAsync(AddBidDto dto, string userId);

        // Tar bort ett bud, kontrollerar att det är användarens eget bud
        Task<Result<DeleteBidResponseDto>> DeleteAsync(DeleteBidDto dto, string userId);

        // Hämtar alla bud för en specifik auktion
        Task<Result<List<BidsGetDto>>> GetBidsForAuction(int auctionId);

        // Hämtar det högsta budet för en specifik auktion
        Task<Result<BidsGetDto>> GetHighestBidsForAuction(int auctionId);

        // Hämtar alla bud som en specifik användare har lagt
        Task<Result<List<BidsGetDto>>> GetBidsByUser(string userId);
    }
}
