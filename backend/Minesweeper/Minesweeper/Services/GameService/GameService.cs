using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.models;
using Minesweeper.models.MinesweeperGame;

namespace Minesweeper.Services.GameService
{
    public class GameService : IGameService
    {
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;
        private readonly IHubContext<GameHub> hubContext;

        public GameService(
            IMapper mapper,
            ApplicationDbContext context,
            IHubContext<GameHub> hubContext
        )
        {
            this.mapper = mapper;
            this.context = context;
            this.hubContext = hubContext;
        }

        public async Task<ServiceResponse<bool>> IsPlayerInGame(string playerId)
        {
            var serviceResponse = new ServiceResponse<bool>();
            try
            {
                var playerExists = await context.GameParticipants.AnyAsync(x => x.PlayerId == playerId);
                serviceResponse.Data = playerExists;
            }
            catch (Exception ex)
            {
                serviceResponse.Data = false;
                serviceResponse.Message = $"Error checking player game status: {ex.Message}";
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<bool>> StartGame(List<MatchmakingQueue> matchedPlayers)
        {
            var serviceResponse = new ServiceResponse<bool>();
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                if (matchedPlayers == null || !matchedPlayers.Any())
                {
                    throw new ArgumentException("Matched players list cannot be null or empty.");
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

                await transaction.CommitAsync();

                // Send game state to players
                MinesweeperGame minesweeperGame = new MinesweeperGame(10);
                foreach (var player in matchedPlayers)
                {
                    await hubContext.Clients.User(player.PlayerId).SendAsync("GameStarted", minesweeperGame.gameField);
                }

                serviceResponse.Data = true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                serviceResponse.Data = false;
                serviceResponse.Message = $"Error starting game: {ex.Message}";
            }

            return serviceResponse;
        }

    }
}
