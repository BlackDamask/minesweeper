using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Minesweeper.models
{
    public class Player : IdentityUser
    {
        public int Points { get; set; }
        public string? Name { get; set; }
    }
}