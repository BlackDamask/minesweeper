using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.models;
using System.Security.AccessControl;

namespace Minesweeper.Services.MatchmakingService
{
    public class MatchmakingService : IMatchmakingService
    {
        private readonly ApplicationDbContext context;
        public MatchmakingService(ApplicationDbContext context) 
        {
            this.context = context;
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
        }
    }
}
