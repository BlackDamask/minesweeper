﻿using Microsoft.AspNetCore.Identity;

namespace Minesweeper.models
{
    public class Player : IdentityUser
    {
        public int Points { get; set; } = 0;
    }
}