using Minesweeper.models.MinesweeperGame;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Minesweeper.models
{
    public class GameParticipant
    {
        public required string Id { get; set; }
        public Game? Game { get; set; }
        public Player? Player { get; set; }
        public string? GameId { get; set; }
        public required string? PlayerId { get; set; }
        
        public int Progress { get; set; } = 0;
    }
}
