namespace Minesweeper.models
{
    public class GameParticipant
    {
        public required string Id { get; set; }
        public string? GameId { get; set; }
        public required string PlayerId { get; set; }
        public int Progress { get; set; } = 0;
    }
}
