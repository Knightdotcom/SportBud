using SportBud.Api.Data.Entities;

namespace SportBud.Api.Data.Interfaces
{
    // Interface som definierar alla databasoperationer för auktioner
    public interface IAuctionRepo
    {
        // Lägger till en ny auktion i databasen
        Task<Auction?> AddAsync(Auction auction);

        // Hämtar alla auktioner, med möjlighet att filtrera på titel
        Task<List<Auction>> GetAllAsync(string titleSearch);

        // Hämtar alla auktioner utan filtrering
        Task<List<Auction>> GetAllAsync();

        // Hämtar alla auktioner som tillhör en specifik användare
        Task<List<Auction>> GetAllByUserAsync(string userId);

        // Hämtar alla auktioner som fortfarande är öppna
        Task<List<Auction>> GetAllOpenAsync();

        // Hämtar alla öppna auktioner, med möjlighet att söka på titel
        Task<List<Auction>> GetAllOpenAsync(string search);

        // Hittar en specifik auktion baserat på dess id
        Task<Auction?> FindByIdAsync(int auctionId);

        // Sparar ändringar till databasen och returnerar true om det lyckades
        Task<bool> SaveChangesAsync();
    }
}
