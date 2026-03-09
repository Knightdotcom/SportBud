using SportBud.Api.Data.Entities;
using SportBud.Api.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SportBud.Api.Data.Repos
{
    // Hanterar alla databasoperationer för bud, implementerar IBidRepo
    public class BidRepo : IBidRepo
    {
        private readonly AppDbContext _context;

        // Konstruktor som tar emot databaskontexten via dependency injection
        public BidRepo(AppDbContext context)
        {
            _context = context;
        }

        // Lägger till ett nytt bud och sparar till databasen
        public async Task<Bid?> AddAsync(Bid bid)
        {
            var result = await _context.Bids.AddAsync(bid);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        // Hämtar alla bud för en auktion, sorterade fallande efter belopp (högsta först)
        public async Task<List<Bid>> BidsByAuctionId(int auctionId)
        {
            return await _context.Bids
                .AsNoTracking()
                .Where(b => b.AuctionId == auctionId)
                .Include(u => u.User)
                .OrderByDescending(b => b.BidAmount)
                .ToListAsync();
        }

        // Hämtar det högsta budet för en specifik auktion
        public async Task<Bid?> HighestBidByAuctionId(int auctionId)
        {
            return await _context.Bids
                .Include(u => u.User)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidAmount)
                .FirstOrDefaultAsync();
        }

        // Tar bort ett bud från databasen, returnerar false om budet inte hittades
        public async Task<bool> DeleteAsync(int bidId)
        {
            var bid = await _context.Bids.FindAsync(bidId);
            if (bid == null) return false;
            _context.Bids.Remove(bid);
            return await _context.SaveChangesAsync() > 0;
        }

        // Hittar ett specifikt bud baserat på dess id
        public async Task<Bid?> FindByIdAsync(int bidId)
        {
            return await _context.Bids.FirstOrDefaultAsync(b => b.Id == bidId);
        }

        // Hämtar alla bud som en specifik användare har lagt
        public async Task<List<Bid>> GetBidByUserId(string userId)
        {
            return await _context.Bids
                .Include(u => u.User)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }
    }
}
