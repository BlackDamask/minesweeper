using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.DTOs.GameDTO;
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

    }
}
