namespace Minesweeper.models
{
    public class GameParticipant
    {
        public int Id { get; set; }
        public int GameId { get; set; }
        public int PlayerId { get; set; }
        public int Progress { get; set; }
    }
}
