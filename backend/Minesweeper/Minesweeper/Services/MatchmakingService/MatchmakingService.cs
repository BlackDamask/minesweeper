using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.models;
using Minesweeper.Services.Minesweeper.Services;
using System.Security.AccessControl;

namespace Minesweeper.Services.MatchmakingService
{
    public class MatchmakingService : IMatchmakingService
    {
        private readonly ApplicationDbContext context;
        private readonly IHubContext<GameHub> hubContext;
        public MatchmakingService(ApplicationDbContext context, IHubContext<GameHub> hubContext)
        {
            this.context = context;
            this.hubContext = hubContext;
        }

        public async Task AddPlayersToGameAsync()
        {
            var eligiblePlayers = await context.MatchmakingQueue
                .OrderBy(q => q.QueeuedAt)
                .ToListAsync();
            var matchedPlayers = new List<MatchmakingQueue>();
            foreach (var player in eligiblePlayers)
            {
                if (matchedPlayers.Count < 2 )
                {
                    matchedPlayers.Add(player);
                }
                else if (matchedPlayers.Count >= 2)
                {
                    break;
                }
            }

            if (matchedPlayers.Count < 2)
            {
                Console.WriteLine("Not enough players to start the game.");
                return;
            }
            var newGame = new Game
            {
                Id = Guid.NewGuid().ToString(),
                StartTime = DateTime.UtcNow,
                Status = "active"
            };

            await context.Games.AddAsync(newGame);
            await context.SaveChangesAsync();

            var gameParticipants = matchedPlayers.Select(player => new GameParticipant
            {
                Id = Guid.NewGuid().ToString(),
                GameId = newGame.Id,
                PlayerId = player.PlayerId,
            }).ToList();

            await context.GameParticipants.AddRangeAsync(gameParticipants);
            await context.SaveChangesAsync();

            context.MatchmakingQueue.RemoveRange(matchedPlayers);
            await context.SaveChangesAsync();

            Console.WriteLine($"Game {newGame.Id} created with {matchedPlayers.Count} players.");

            foreach (var player in matchedPlayers)
            {
                await hubContext.Clients.All.SendAsync("GameStarted");
            }
        }
    }
}
