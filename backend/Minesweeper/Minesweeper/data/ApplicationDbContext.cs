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
        public DbSet<GameParticipant> GameParticipants => Set<GameParticipant>();
        public DbSet<Game> Games => Set<Game>();
        public DbSet<MatchmakingQueue> MatchmakingQueue => Set<MatchmakingQueue>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasDefaultSchema("identity");

            builder.Entity<RefreshToken>()
                .HasKey(r => r.Token);

            builder.Entity<RefreshToken>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
