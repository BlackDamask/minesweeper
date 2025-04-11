namespace Minesweeper.DTOs.GameDTO
{
    public class GameEndDTO
    {
        public bool IsWon { get; set; }
        public int NewElo { get; set; }
        public int EloChange { get; set; }

    }
}
