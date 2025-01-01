using Minesweeper.models.MinesweeperGame;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Minesweeper.models
{
    public class GameParticipant
    {
        public required string Id { get; set; }
        public string? GameId { get; set; }
        public required string PlayerId { get; set; }

        public string? GameFieldSerialized { get; set; } 

        [NotMapped]
        public Tile[][]? GameField
        {
            get => GameFieldSerialized == null ? null : JsonSerializer.Deserialize<Tile[][]>(GameFieldSerialized);
            set => GameFieldSerialized = value == null ? null : JsonSerializer.Serialize(value);
        }
        public int Progress { get; set; } = 0;
    }
}
