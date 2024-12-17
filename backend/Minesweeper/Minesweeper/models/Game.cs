namespace Minesweeper.models
{
    public class Game
    {       
        public required string Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required string Status { get; set; }
        public string? GameType { get; set; }
    }
}
