using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Minesweeper.models;

namespace Minesweeper.data
{
    public class ApplicationDbContext: IdentityDbContext<Player>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
            
        }
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasDefaultSchema("identity");

            builder.Entity<RefreshToken>()
                .HasKey(r => r.Token);  

            // Optionally, configure foreign key relationship between RefreshToken and Player (AspNetUsers)
            builder.Entity<RefreshToken>()
                .HasOne<Player>()  // This assumes that Player is the User entity
                .WithMany()  // No need for a navigation property on the Player side
                .HasForeignKey(r => r.UserId)  // Reference to Player's Id
                .OnDelete(DeleteBehavior.Cascade);  // Optionally delete tokens when the user is deleted
        }
    }
}
