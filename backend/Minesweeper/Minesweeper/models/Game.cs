using Minesweeper.models.MinesweeperGame;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Minesweeper.models
{
    public class Game
    {
        public required string Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required int ColBeginIndex { get; set; }
        public required int RowBeginIndex { get; set; }
        public string? GameFieldSerialized { get; set; }

        [NotMapped]
        public Tile[][]? GameField
        {
            get => GameFieldSerialized == null ? null : JsonSerializer.Deserialize<Tile[][]>(GameFieldSerialized);
            set => GameFieldSerialized = value == null ? null : JsonSerializer.Serialize(value);
        }

        public required string Status { get; set; }
        public string? GameType { get; set; }
    }
}