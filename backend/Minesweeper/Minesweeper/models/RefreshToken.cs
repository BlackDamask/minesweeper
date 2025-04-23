using Microsoft.EntityFrameworkCore;

namespace Minesweeper.models
{
    public class RefreshToken
    {
        public required string Token { get; set; }
        public required string UserId { get; set; }
        public DateTime Expiration { get; set; }
        public Player? User { get; set; }
    }
}
