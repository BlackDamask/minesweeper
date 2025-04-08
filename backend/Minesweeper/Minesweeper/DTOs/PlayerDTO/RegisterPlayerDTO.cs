namespace Minesweeper.DTOs.PlayerDTO
{
    public class RegisterPlayerDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string PlayerName { get; set; } = string.Empty;
        public bool IsGuest { get; set; } = false;
        public string? ClientUri { get; set; }   
    }
}
