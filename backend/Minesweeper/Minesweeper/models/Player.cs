using Microsoft.AspNetCore.Identity;

namespace Minesweeper.models
{
    public class Player : IdentityUser
    {
        public string? PlayerName { get; set; }
        public int Elo { get; set; } = 500;
        public bool IsGuest { get; set; } = false;
        public List<string>? FriendsId { get; set; }
    }
}
