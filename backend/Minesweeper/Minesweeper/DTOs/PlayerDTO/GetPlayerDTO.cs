namespace Minesweeper.DTOs.PlayerDTO
{
    public class GetPlayerDTO
    {
        public required string PlayerName { get; set; }
        public int? Points { get; set; }
        public string? AccessToken { get; set; }
    }
}
