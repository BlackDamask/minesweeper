namespace Minesweeper.models.MinesweeperGame
{
    public class Tile
    {
        public string? Color { get; set; }
        public bool HasBomb { get; set; }
        public int? NearbyBombs { get; set; }
        public bool IsFlagged { get; set; }
        public bool IsRevealed { get; set; }
    }
}
