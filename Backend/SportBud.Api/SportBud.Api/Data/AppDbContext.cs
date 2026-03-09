using SportBud.Api.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace SportBud.Api.Data
{
    // Databaskontexten för applikationen, ärver från IdentityDbContext för att hantera användare och roller
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        // Representerar tabellen för bud i databasen
        public DbSet<Bid> Bids => Set<Bid>();

        // Representerar tabellen för auktioner i databasen
        public DbSet<Auction> Auctions => Set<Auction>();

        // Konstruktor som tar emot databaskonfiguration och skickar vidare till basklassen
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Konfigurerar relationer och regler för databasmodellen
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfigurerar relationen mellan Bid och Auction - ett bud tillhör en auktion
            // OnDelete NoAction förhindrar att bud raderas automatiskt när en auktion tas bort
            modelBuilder.Entity<Bid>()
                .HasOne(b => b.Auction)
                .WithMany(a => a.Bids)
                .HasForeignKey(b => b.AuctionId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
