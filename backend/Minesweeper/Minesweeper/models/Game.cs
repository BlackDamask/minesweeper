namespace Minesweeper.models
{
    public class Game
    {       
        public int Id { get; set; }
        public DateTime startTime { get; set; }
        public DateTime endTime { get; set; }
        public required string Status { get; set; }
        public string? gameType { get; set; }
    }
}
