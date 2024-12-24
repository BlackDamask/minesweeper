using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.models;
using Minesweeper.Services;
using Minesweeper.Services.GameService;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Minesweeper.Services.MatchmakingService
{
    public class MatchmakingService : IMatchmakingService
    {
        private readonly ApplicationDbContext context;
        private readonly IGameService gameService;

        public MatchmakingService(ApplicationDbContext context, IHubContext<GameHub> hubContext, IGameService gameService)
        {
            this.context = context;
            this.gameService = gameService;
        }

        public async Task AddPlayersToGameAsync()
        {
            var eligiblePlayers = await context.MatchmakingQueue
                .OrderBy(q => q.QueeuedAt)
                .ToListAsync();

            if (eligiblePlayers.Count < 2)
            {
                Console.WriteLine("Not enough players to start the game.");
                return;
            }

            var matchedPlayers = eligiblePlayers.Take(2).ToList();

            if (matchedPlayers[0].PlayerId == matchedPlayers[1].PlayerId)
            {
                var duplicatePlayer = matchedPlayers[1];
                var existingQueueEntry = await context.MatchmakingQueue
                    .FirstOrDefaultAsync(q => q.PlayerId == duplicatePlayer.PlayerId);
                if (existingQueueEntry != null)
                {
                    context.MatchmakingQueue.Remove(existingQueueEntry);
                    await context.SaveChangesAsync(); // Save here to prevent context reuse issues.
                }
                Console.WriteLine("Players have the same ID.");
                return;
            }

            // Start game and remove matched players
            gameService.StartGame(matchedPlayers);

            context.MatchmakingQueue.RemoveRange(matchedPlayers);
            await context.SaveChangesAsync();
        }


    }
}
