﻿using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Validations;
using Minesweeper.data;
using Minesweeper.DTOs;
using Minesweeper.DTOs.GameDTO;
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
        public async Task<ServiceResponse<GameBeginDTO>> AddPlayerToQueue(string playerId)
        {
            var serviceResponse = new ServiceResponse<GameBeginDTO>();
            try
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("Received add to queue request");
                Console.ResetColor();
                var player = await context.Users.FindAsync(playerId)
                              ?? throw new Exception("Player not found");

                var existingGameParticipant =  context.GameParticipants.FirstOrDefault(p => p.PlayerId == playerId);

                if (existingGameParticipant != null)
                {
                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.WriteLine("existingGameParticipant != null");
                    Console.ResetColor();

                    var game = context.Games.FirstOrDefault(g => g.Id == existingGameParticipant.GameId);
                    var enemy = context.GameParticipants
                        .Where(g => g.GameId == game.Id)
                        .Where(g => g.PlayerId != existingGameParticipant.PlayerId)
                        .FirstOrDefault() ?? throw new Exception("Enemy not found");

                    var enemyName = context.Users
                        .Where(u => u.Id == enemy.PlayerId)
                        .Select(u => u.PlayerName)
                        .FirstOrDefault() ?? throw new Exception("Enemy name not found");

                    var response = new GameBeginDTO
                    {
                        ColBeginIndex = game!.ColBeginIndex,
                        RowBeginIndex = game.RowBeginIndex,
                        GameField = game.GameField,
                        EnemyName = enemyName,
                        EnemyProgress = enemy.Progress,
                        StartTime = game.StartTimeNumeric
                    };

                    serviceResponse.Data = response;
                    serviceResponse.Message = "Player is already in game";
                    return serviceResponse;
                }

                var existingQueueEntry = await context.MatchmakingQueue
                    .FirstOrDefaultAsync(q => q.PlayerId == player.Id);

                if (existingQueueEntry != null)
                {
                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.WriteLine("existingQueueEntry != null");
                    Console.ResetColor();

                    context.MatchmakingQueue.Remove(existingQueueEntry);
                    await context.SaveChangesAsync();
                }

                context.MatchmakingQueue.Add(
                    new MatchmakingQueue
                    {
                        Id = Guid.NewGuid().ToString(),
                        PlayerId = player.Id,
                        QueeuedAt = DateTime.UtcNow,
                    });

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("added to queue "+ player.UserName);
                Console.ResetColor();

                await context.SaveChangesAsync();

                serviceResponse.Data = null;
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

        public async Task<ServiceResponse<string>> ChangeUserName(string playerId, string userName)
        {
            var serviceResponse = new ServiceResponse<string>();

            try
            {
                var player = await context.Users.FirstOrDefaultAsync(p => p.Id == playerId) ?? throw new Exception("Player not found");
                player.UserName = userName;
                await context.SaveChangesAsync();
                serviceResponse.Data = player.UserName;
                serviceResponse.Success = true;

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
