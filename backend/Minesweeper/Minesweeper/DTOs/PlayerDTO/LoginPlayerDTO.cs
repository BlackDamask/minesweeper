using System.Reflection.Metadata.Ecma335;

namespace Minesweeper.DTOs.PlayerDTO
{
    public class LoginPlayerDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool IsGuest { get; set; }
    }
}
