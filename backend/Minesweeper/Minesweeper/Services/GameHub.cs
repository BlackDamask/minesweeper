﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.OpenApi.Validations;
using Minesweeper.data;
using Minesweeper.DTOs.GameDTO;
using Minesweeper.models;
using Minesweeper.models.MinesweeperGame;
using System;
using System.Data.Common;
using System.Security.Claims;
using System.Text.Json;

namespace Minesweeper.Services
{
    [Authorize]
    public class GameHub : Hub, IDisposable
    {
        private readonly ApplicationDbContext dbContext;

        public GameHub(ApplicationDbContext context)
        {
            this.dbContext = context;
        }


        public async Task SendProgress(ReceiveProgressDTO response)
        {

            try
            {
                var player = dbContext.Users
                    .Where(p => p.Id == Context.UserIdentifier)
                    .FirstOrDefault() ?? throw new Exception("Player not found");

                Console.WriteLine("Received progress: " + Convert.ToString(response.Progress)+ Convert.ToString(response.IsExploaded) + " from user: " + player.UserName);

                string gameId = dbContext.GameParticipants
                    .Where(gp => gp.PlayerId == Context.UserIdentifier)
                    .Select(gp => gp.GameId)
                    .FirstOrDefault() ?? throw new Exception("Game not found");

                var enemy = dbContext.GameParticipants
                    .Where(gp => gp.GameId == gameId && gp.PlayerId != Context.UserIdentifier)
                    .FirstOrDefault() ?? throw new Exception("Enemy not found");

                var sendResponse = new SendProgressDTO { IsExploaded = response.IsExploaded, Progress = response.Progress };

                await Clients.User(enemy.PlayerId).SendAsync("ReceiveProgress", sendResponse);

                var playerGp = dbContext.GameParticipants
                        .Where(p => p.PlayerId == Context.UserIdentifier)
                        .FirstOrDefault() ?? throw new Exception("PlayerGP not found");
                playerGp.Progress = response.Progress;

                await dbContext.SaveChangesAsync();


                if (response.Progress == 100)
                {
                    var game = dbContext.Games
                        .Where(g => g.Id == gameId)
                        .FirstOrDefault() ?? throw new Exception("Game not found");
                    

                    game.IsActive = false;

                    await Clients.User(Context.UserIdentifier).SendAsync("GameWon");
                    await Clients.User(enemy.PlayerId).SendAsync("GameLost");

                    dbContext.GameParticipants.Remove(enemy);
                    dbContext.GameParticipants.Remove(playerGp);
                    dbContext.SaveChanges();

                    Console.WriteLine("GameEnded");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            

        }

        public override async Task OnConnectedAsync()
        {


            await Clients.All.SendAsync("ReceiveSystemMessage",
                $"{Context.UserIdentifier} joined.");
            Console.WriteLine(Clients.ToString());

        }
    }
}
