using Microsoft.AspNetCore.SignalR;

namespace Minesweeper.Services
{
    using Microsoft.AspNetCore.SignalR;

    namespace Minesweeper.Services
    {
        public class GameHub : Hub
        {
            public async Task NotifyGameStarted(string playerId)
            {
                await Clients.User(playerId).SendAsync("GameStarted");
            }
        }
    }
}
