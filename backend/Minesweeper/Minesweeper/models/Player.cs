using Microsoft.AspNetCore.Identity;

namespace Minesweeper.models
{
    public class Player : IdentityUser
    {
        public string? PlayerName { get; set; }
        public int Points { get; set; } = 0;
        public bool IsGuest { get; set; } = false;
    }
}
