namespace Minesweeper.models
{
    public class MatchmakingQueue
    {
        public required string Id { get; set; }
        public required string PlayerId { get; set; }
        public string? GameType { get; set; }
        public DateTime QueeuedAt { get; set; }
    }
}
