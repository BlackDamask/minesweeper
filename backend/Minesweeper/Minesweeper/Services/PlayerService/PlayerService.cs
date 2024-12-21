using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Validations;
using Minesweeper.data;
using Minesweeper.DTOs;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Minesweeper.Services.PlayerService
{
    public class PlayerService : IPlayerService
    {

        private readonly UserManager<Player> playerManager;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;

        public PlayerService(
            UserManager<Player> playerManager,
            IMapper mapper,
            IConfiguration configuration,
            ApplicationDbContext context
        )
        {
            this.playerManager = playerManager;
            this.mapper = mapper;
            this.configuration = configuration;
            this.context = context;
        }
        

        public async Task<ServiceResponse<GetPlayerDTO>> GetProfile(string playerId)
        {
            var serviceResponse = new ServiceResponse<GetPlayerDTO>();

            var player = await context.Users.FindAsync(playerId);
            serviceResponse.Data = mapper.Map<GetPlayerDTO>(player);
            serviceResponse.Success = true;
            return serviceResponse;
        }

        public async Task<ServiceResponse<int>> ChangePoints(string playerId, int pointsChange)
        {
            var serviceResponse = new ServiceResponse<int>();

            var player = await context.Users.FindAsync(playerId);
            player!.Points = player.Points + pointsChange;

            serviceResponse.Data = player.Points;
            serviceResponse.Success = true;

            await context.SaveChangesAsync();
            return serviceResponse;
        }

        public async Task<ServiceResponse<string>> AddPlayerToQueue(string playerId)
        {
            var serviceResponse = new ServiceResponse<string>();
            try
            {
                var player = await context.Users.FindAsync(playerId)
                              ?? throw new Exception("Player not found");
                var existingQueueEntry = await context.MatchmakingQueue
                    .FirstOrDefaultAsync(q => q.PlayerId == player.Id);

                if (existingQueueEntry != null)
                {
                    
                    context.MatchmakingQueue.Remove(existingQueueEntry);
                    await context.SaveChangesAsync();
                }

                // Add the player to the queue
                context.MatchmakingQueue.Add(
                    new MatchmakingQueue
                    {
                        Id = Guid.NewGuid().ToString(),
                        PlayerId = player.Id,
                        QueeuedAt = DateTime.UtcNow,
                    });

                await context.SaveChangesAsync();

                // Prepare success response
                
                serviceResponse.Data = player.Id;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }



        

        public async Task<ServiceResponse<string>> RemovePlayerFromQueue(string playerId)
        {
            var serviceResponse = new ServiceResponse<string>();
            try
            {
                var position = await context.MatchmakingQueue.FirstOrDefaultAsync(p => p.PlayerId == playerId) ?? throw new Exception("Player not found");
                context.MatchmakingQueue.Remove(position);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                serviceResponse.Message = ex.Message;
                serviceResponse.Success = false;
            }
            return serviceResponse;
        }
    }

}
