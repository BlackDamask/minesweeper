using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Security.Claims;

namespace Minesweeper.Services
{
    [Authorize]
    public class GameHub : Hub, IDisposable
    {

        public async Task NotifyGameStarted(string playerId)
        {

            await Clients.User(playerId).SendAsync("GameStarted");

        }

        public async Task SendGameField()
        {
            await Clients.All.SendAsync("RecieveGameField");
        }

        public override async Task OnConnectedAsync()
        {


            await Clients.All.SendAsync("ReceiveSystemMessage",
                $"{Context.UserIdentifier} joined.");

        }
    }
}
