using System.Reflection.Metadata.Ecma335;

namespace Minesweeper.DTOs.PlayerDTO
{
    public class LoginPlayerDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public bool IsGuest { get; set; }
    }
}
