namespace Minesweeper.DTOs.PlayerDTO
{
    public class UpdatePlayerDTO
    {
        public string? Name { get; set; }
        public required string Password { get; set; }
        public int Points { get; set; }

    }
}
