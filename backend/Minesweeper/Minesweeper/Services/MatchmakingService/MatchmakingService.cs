using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.models;
using Minesweeper.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Minesweeper.Services.MatchmakingService
{
    public class MatchmakingService : IMatchmakingService
    {
        private readonly ApplicationDbContext context;
        private readonly IHubContext<GameHub> hubContext;

        public MatchmakingService(ApplicationDbContext context, IHubContext<GameHub> hubContext)
        {
            this.context = context ?? throw new ArgumentNullException(nameof(context));
            this.hubContext = hubContext ?? throw new ArgumentNullException(nameof(hubContext));
        }

        public async Task AddPlayersToGameAsync()
        {
            var eligiblePlayers = await context.MatchmakingQueue
                .OrderBy(q => q.QueeuedAt)
                .ToListAsync();

            var matchedPlayers = new List<MatchmakingQueue>();
            foreach (var player in eligiblePlayers)
            {
                if (matchedPlayers.Count < 2)
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

            if (matchedPlayers[0].PlayerId == matchedPlayers[1].PlayerId)
            {
                var existingQueueEntry = await context.MatchmakingQueue
                    .FirstOrDefaultAsync(q => q.PlayerId == matchedPlayers[1].PlayerId);
                if (existingQueueEntry != null)
                {
                    context.MatchmakingQueue.Remove(existingQueueEntry);
                    await context.SaveChangesAsync();
                }
                Console.WriteLine("Players have the same ID.");
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
                await hubContext.Clients.User(player.PlayerId).SendAsync("GameStarted");
            }
        }
    }
}
