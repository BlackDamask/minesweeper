using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Minesweeper.data;
using Minesweeper.models;
using System;
using System.Data.Common;
using System.Security.Claims;

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


        public async Task SendProgress(int progress)
        {
            Console.WriteLine(progress);
            var player = dbContext.GameParticipants.Where(p => p.PlayerId == Context.UserIdentifier).FirstOrDefault() ?? throw new Exception("Player not found");
            string gameId = dbContext.GameParticipants
                .Where(gp => gp.PlayerId == Context.UserIdentifier)
                .Select(gp => gp.GameId)
                .FirstOrDefault() ?? throw new Exception("Game not found");

            string enemyId = dbContext.GameParticipants
                .Where(gp => gp.GameId == gameId && gp.PlayerId != Context.UserIdentifier)
                .Select(gp => gp.PlayerId)
                .FirstOrDefault() ?? throw new Exception("Enemy not found");

            await Clients.User(enemyId).SendAsync("ReceiveProgress", progress);
        }

        public override async Task OnConnectedAsync()
        {


            await Clients.All.SendAsync("ReceiveSystemMessage",
                $"{Context.UserIdentifier} joined.");

        }
    }
}
