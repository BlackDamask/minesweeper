namespace Minesweeper.DTOs.PlayerDTO
{
    public class RegisterPlayerDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string UserName { get; set; } = string.Empty;
    }
}
