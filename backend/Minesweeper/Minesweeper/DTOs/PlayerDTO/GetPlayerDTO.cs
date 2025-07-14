namespace Minesweeper.DTOs.PlayerDTO
{
    public class GetPlayerDTO
    {
        public required string Id { get; set; }
        public required string PlayerName { get; set; }
        public int? Points { get; set; }
    }
}
