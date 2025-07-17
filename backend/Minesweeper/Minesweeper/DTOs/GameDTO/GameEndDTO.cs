namespace Minesweeper.DTOs.GameDTO
{
    public class GameEndDto
    {
        public bool IsWon { get; set; }
        public int NewElo { get; set; }
        public int EloChange { get; set; }
        public TimeSpan WinnersTime { get; set; }
        public bool IsNewRecord { get; set; } = false;
    }
}