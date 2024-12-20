using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;


namespace Minesweeper.Services
{
    [Authorize]
    public class GameHub : Hub
    {
        public async Task NotifyGameStarted(string playerId)
        {
            await Clients.User(playerId).SendAsync("GameStarted");
        }
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("ReceiveSystemMessage",
                                    $"{Context.UserIdentifier} joined.");
            await base.OnConnectedAsync();
        }
    }
}

