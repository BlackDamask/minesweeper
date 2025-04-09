namespace Minesweeper.DTOs.GameDTO
{
    public class GameEndDTO
    {
        public bool isWon { get; set; }
        public int NewElo { get; set; }
        public int EloChange { get; set; }

    }
}
