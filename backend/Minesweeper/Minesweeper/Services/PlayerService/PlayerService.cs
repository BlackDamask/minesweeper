using AutoMapper;
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
                    Console.WriteLine("player is already in queue");
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
                var player = await context.Users.FirstOrDefaultAsync(p => p.Id == playerId) ?? throw new Exception("Player not found");
                string playerName = player.UserName;
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("removed from queue "+ player.UserName);
                Console.ResetColor();
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

        public async Task<ServiceResponse<List<GetPlayerDTO>>> GetAllPlayers()
        {
            var serviceResponse = new ServiceResponse<List<GetPlayerDTO>>();
            try
            {
                var players = await context.Users.ToListAsync();
                serviceResponse.Data = players.Select(p => mapper.Map<GetPlayerDTO>(p)).ToList();
                serviceResponse.Success = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetPlayerDTO>>> SearchPlayersByName(string namePart, string currentPlayerId)
        {
            var serviceResponse = new ServiceResponse<List<GetPlayerDTO>>();
            try
            {
                var currentPlayer = await context.Users.FindAsync(currentPlayerId);
                var friends = currentPlayer?.FriendsId ?? new List<string>();

                var players = await context.Users
                    .Where(p => p.PlayerName != null
                                && p.PlayerName.ToLower().Contains(namePart.ToLower())
                                && p.Id != currentPlayerId
                                && !friends.Contains(p.Id))
                    .OrderBy(p => p.PlayerName)
                    .Take(5)
                    .ToListAsync();

                serviceResponse.Data = players.Select(p => mapper.Map<GetPlayerDTO>(p)).ToList();
                serviceResponse.Success = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetPlayerDTO>>> GetFriends(string playerId)
        {
            var serviceResponse = new ServiceResponse<List<GetPlayerDTO>>();
            try
            {
                var player = await context.Users.FindAsync(playerId);
                if (player == null)
                    throw new Exception("Player not found");

                var friendsIds = player.FriendsId ?? new List<string>();
                var friends = await context.Users
                    .Where(u => friendsIds.Contains(u.Id))
                    .ToListAsync();

                serviceResponse.Data = friends.Select(f => mapper.Map<GetPlayerDTO>(f)).ToList();
                serviceResponse.Success = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<bool>> RemoveFriend(string playerId, string friendId)
        {
            var serviceResponse = new ServiceResponse<bool>();
            try
            {
                var player = await context.Users.FindAsync(playerId);
                var friend = await context.Users.FindAsync(friendId);

                if (player == null || friend == null)
                    throw new Exception("Player or friend not found.");

                player.FriendsId ??= new List<string>();
                friend.FriendsId ??= new List<string>();

                bool removedFromPlayer = player.FriendsId.Remove(friendId);
                bool removedFromFriend = friend.FriendsId.Remove(playerId);

                await context.SaveChangesAsync();

                serviceResponse.Data = removedFromPlayer && removedFromFriend;
                serviceResponse.Success = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Data = false;
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<int?[]>> GetRecords(string playerId)
        {
            var serviceResponse = new ServiceResponse<int?[]>();
            try
            {
                var player = await context.Users.FindAsync(playerId);
                if (player == null)
                    throw new Exception("Player not found");

                serviceResponse.Data = player.Records;
                serviceResponse.Success = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<int?[]>> SetRecords(string playerId, int?[] newRecords)
        {
            var serviceResponse = new ServiceResponse<int?[]>();
            try
            {
                var player = await context.Users.FindAsync(playerId);
                if (player == null)
                    throw new Exception("Player not found");

                for (int i = 0; i < player.Records.Length && i < newRecords.Length; i++)
                {
                    if (newRecords[i] != null)
                    {
                        player.Records[i] = newRecords[i];
                    }
                }

                await context.SaveChangesAsync();
                serviceResponse.Data = player.Records;
                serviceResponse.Success = true;
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }
        
        
    }

}
