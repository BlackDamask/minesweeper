using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.DTOs.GameDTO;
using Minesweeper.models;
using Minesweeper.models.MinesweeperGame;
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

            if (matchedPlayers[0].PlayerId == matchedPlayers[1].PlayerId || matchedPlayers[0] is null || matchedPlayers[1] is null)
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

            MinesweeperGame minesweeperGame = new MinesweeperGame(1);

            string enemyName = context.Users
                .Where(u => u.Id == matchedPlayers[1].PlayerId)
                .Select(u => u.UserName) 
                .FirstOrDefault() ?? throw new Exception("Player not found");
            GameBeginDTO response = new GameBeginDTO
            {
                GameField = minesweeperGame.gameField,
                ColBeginIndex = minesweeperGame.colStartIndex,
                RowBeginIndex = minesweeperGame.rowStartIndex,
                EnemyName = enemyName,
            };

            await hubContext.Clients.User(matchedPlayers[0].PlayerId).SendAsync("GameStarted", response);

            enemyName = context.Users
                .Where(u => u.Id == matchedPlayers[0].PlayerId)
                .Select(u => u.UserName)
                .FirstOrDefault() ?? throw new Exception("Player not found");
            response.EnemyName = enemyName;

            await hubContext.Clients.User(matchedPlayers[1].PlayerId).SendAsync("GameStarted", response);
        }
    }
}
