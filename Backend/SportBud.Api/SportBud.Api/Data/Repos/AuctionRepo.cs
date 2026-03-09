using SportBud.Api.Data.Entities;
using SportBud.Api.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SportBud.Api.Data.Repos
{
    // Hanterar alla databasoperationer för auktioner, implementerar IAuctionRepo
    public class AuctionRepo : IAuctionRepo
    {
        private readonly AppDbContext _context;

        // Konstruktor som tar emot databaskontexten via dependency injection
        public AuctionRepo(AppDbContext context)
        {
            _context = context;
        }

        // Lägger till en ny auktion och sparar till databasen
        public async Task<Auction?> AddAsync(Auction auction)
        {
            var result = await _context.Auctions.AddAsync(auction);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        // Hämtar alla auktioner med möjlighet att söka på titel, inkluderar användare och bud
        public async Task<List<Auction>> GetAllAsync(string titleSearch)
        {
            IQueryable<Auction> query = _context.Auctions
                .Include(u => u.User)
                .Include(b => b.Bids);

            // Filtrerar på titel om söktexten inte är tom
            if (!string.IsNullOrWhiteSpace(titleSearch))
            {
                query = query.Where(a => a.Title.ToLower().Contains(titleSearch.ToLower()));
            }

            return await query.ToListAsync() ?? new List<Auction>();
        }

        // Hämtar alla auktioner utan filtrering, inkluderar användare och bud
        public async Task<List<Auction>> GetAllAsync()
        {
            return await _context.Auctions
                .Include(u => u.User)
                .Include(b => b.Bids)
                .ToListAsync();
        }

        // Hämtar alla auktioner som tillhör en specifik användare
        public async Task<List<Auction>> GetAllByUserAsync(string userId)
        {
            return await _context.Auctions
                .Where(a => a.UserId == userId)
                .Include(b => b.Bids)
                .ToListAsync();
        }

        // Hämtar en specifik auktion med dess användare och bud baserat på id
        public async Task<Auction?> FindByIdAsync(int auctionId)
        {
            return await _context.Auctions
                .Include(u => u.User)
                .Include(b => b.Bids)
                .FirstOrDefaultAsync(a => a.AuctionId == auctionId);
        }

        // Sparar alla väntande ändringar i databaskontexten
        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        // Hämtar alla auktioner som fortfarande är öppna (sluttid är i framtiden)
        public async Task<List<Auction>> GetAllOpenAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Auctions
                .Include(u => u.User)
                .Include(b => b.Bids)
                .Where(a => now < a.EndAtUtc)
                .ToListAsync();
        }

        // Hämtar alla öppna auktioner med möjlighet att söka på titel
        public async Task<List<Auction>> GetAllOpenAsync(string search)
        {
            var now = DateTime.UtcNow;
            IQueryable<Auction> query = _context.Auctions
                .Include(u => u.User)
                .Include(b => b.Bids)
                .Where(a => now < a.EndAtUtc);

            // Filtrerar på titel om söktexten inte är tom
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(a => a.Title.ToLower().Contains(search.ToLower()));
            }

            return await query.ToListAsync() ?? new List<Auction>();
        }
    }
}
