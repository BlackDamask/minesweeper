using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Security.Claims;

namespace Minesweeper.Services
{
    [Authorize]
    public class GameHub : Hub, IDisposable
    {
        private bool _isDisposed = false;

        public async Task NotifyGameStarted(string playerId)
        {
            if (!_isDisposed)
            {
                await Clients.User(playerId).SendAsync("GameStarted");
            }
        }

        public override async Task OnConnectedAsync()
        {
            if (!_isDisposed)
            {
                await Clients.All.SendAsync("ReceiveSystemMessage",
                    $"{Context.UserIdentifier} joined.");
            }
            await base.OnConnectedAsync();
        }

        protected override void Dispose(bool disposing)
        {
            if (!_isDisposed)
            {
                if (disposing)
                {
                    // Perform managed resource cleanup if needed.
                    Clients.All.SendAsync("ReceiveSystemMessage",
                        $"{Context.UserIdentifier} left.").Wait();
                }

                _isDisposed = true;
            }
            base.Dispose(disposing);
        }
    }
}
