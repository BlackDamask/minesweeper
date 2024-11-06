using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Minesweeper.models;

namespace Minesweeper.data
{
    public class DataContext : IdentityDbContext<Player>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        { }
        
        public DbSet<Player> Players => Set<Player>();
        public DbSet<Room> Rooms => Set<Room>();
    }
}