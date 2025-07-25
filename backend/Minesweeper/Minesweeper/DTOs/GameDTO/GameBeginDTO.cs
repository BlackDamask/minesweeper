﻿using Minesweeper.models.MinesweeperGame;

namespace Minesweeper.DTOs.GameDTO
{
    public class GameBeginDTO
    {
        public Tile[][]? GameField { get; set; }
        public required int ColBeginIndex { get; set; }
        public required int RowBeginIndex { get; set; }
        public required string EnemyName { get; set; }
        public required string EnemyId { get; set; }
        public int? EnemyProgress { get; set; }
        public int StartTime { get; set; }
    }
}
