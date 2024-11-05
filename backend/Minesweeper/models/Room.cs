using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Minesweeper.models
{
    public class Room
    {
        public int Id { get; set; }
        public List<int>? PlayerId { get; set; }
        public int? Difficulty { get; set; }
        public string? FirstPlayerGameData { get; set; }
        public string? SecondPlayerGameData { get; set; }
        public int? FirstPlayerProgress { get; set; }
        public int? SecondPlayerProgress { get; set; }
        public int? Winner { get; set; }
    }
}