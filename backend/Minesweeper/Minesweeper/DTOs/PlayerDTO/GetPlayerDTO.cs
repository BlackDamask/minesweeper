namespace Minesweeper.DTOs.PlayerDTO
{
    public class GetPlayerDTO
    {
        public required string UserName { get; set; }
        public int? Points { get; set; }
    }
}
