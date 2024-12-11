namespace Minesweeper.models
{
    public class MatchmakingQueue
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public string? GameType { get; set; }
        public DateTime QueeuedAt { get; set; }
    }
}
