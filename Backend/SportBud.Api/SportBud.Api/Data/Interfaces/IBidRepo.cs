using SportBud.Api.Data.Entities;

namespace SportBud.Api.Data.Interfaces
{
    // Interface som definierar alla databasoperationer för bud
    public interface IBidRepo
    {
        // Lägger till ett nytt bud i databasen
        Task<Bid?> AddAsync(Bid bid);

        // Hittar ett specifikt bud baserat på dess id
        Task<Bid?> FindByIdAsync(int bidId);

        // Tar bort ett bud från databasen och returnerar true om det lyckades
        Task<bool> DeleteAsync(int bidId);

        // Hämtar alla bud för en specifik auktion, sorterade efter belopp
        Task<List<Bid>> BidsByAuctionId(int auctionId);

        // Hämtar det högsta budet på en specifik auktion
        Task<Bid?> HighestBidByAuctionId(int auctionId);

        // Hämtar alla bud som en specifik användare har lagt
        Task<List<Bid>> GetBidByUserId(string userId);
    }
}
