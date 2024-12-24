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
                var player = await context.GameParticipants.FirstOrDefaultAsync(x => x.PlayerId == playerId) ?? throw new Exception("player is not in a game");
                serviceResponse.Data = false;
            }
            catch(Exception ex) 
            { 
                serviceResponse.Data = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<bool>> StartGame(List<MatchmakingQueue> matchedPlayers)
        {
            var serviceResponse = new ServiceResponse<bool>();
            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
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

                Console.WriteLine($"Game {newGame.Id} created with {gameParticipants.Count} players.");

                MinesweeperGame minesweeperGame = new MinesweeperGame(1);

                foreach (var player in matchedPlayers)
                {
                    await hubContext.Clients.User(player.PlayerId).SendAsync("GameStarted", minesweeperGame);
                }
                serviceResponse.Data = true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                serviceResponse.Data = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

    }
}
