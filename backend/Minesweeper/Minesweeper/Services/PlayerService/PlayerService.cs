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
        public async Task<ServiceResponse<LoginPlayerResponseDTO>> Login(LoginPlayerDTO player)
        {
            var serviceResponse = new ServiceResponse<LoginPlayerResponseDTO>();
            var loggedPlayer = await playerManager.FindByNameAsync(player.UserName);
            if (loggedPlayer == null) { 
                serviceResponse.Success = false;
                serviceResponse.Message = "User not found";
                return serviceResponse;
            }
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, loggedPlayer.Id),
                new Claim(ClaimTypes.Name, loggedPlayer.UserName!)
            };

            var accessToken = GenerateAccessToken(claims);
            var refreshToken = GenerateRefreshToken(claims);

            await context.RefreshTokens.AddAsync(new RefreshToken
            {
                Token = refreshToken,
                UserId = loggedPlayer.Id,
                Expiration = DateTime.UtcNow.AddDays(Convert.ToDouble(configuration["Jwt:RefreshTokenExpirationDays"]))
            });

            await context.SaveChangesAsync();
            
            serviceResponse.Success = true;
            serviceResponse.Data = new LoginPlayerResponseDTO 
                { 
                    AccessToken = accessToken, 
                    RefreshToken = refreshToken 
                };


            return serviceResponse;
        }

        public async Task<ServiceResponse<string>> Register(RegisterPlayerDTO newPlayer)
        {
            var serviceResponse = new ServiceResponse<string>();
            var player = mapper.Map<Player>(newPlayer);

            var result = await playerManager.CreateAsync(player, newPlayer.Password);
            if (result.Succeeded)
            {
                serviceResponse.Message = "Registration succeeded";
                serviceResponse.Success = true;
            }
            else
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                serviceResponse.Message = errors;
                serviceResponse.Success = false;
            }
            return serviceResponse;
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
                // Retrieve player and throw an exception if not found
                var player = await context.Users.FindAsync(playerId)
                              ?? throw new Exception("Player not found");

                // Check for existing queue entry for the player
                var existingQueueEntry = await context.MatchmakingQueue
                    .FirstOrDefaultAsync(q => q.PlayerId == player.Id);

                if (existingQueueEntry != null)
                {
                    // Remove existing entry if found
                    context.MatchmakingQueue.Remove(existingQueueEntry);
                    await context.SaveChangesAsync(); // Save the removal explicitly
                }

                // Add the player to the queue
                context.MatchmakingQueue.Add(
                    new MatchmakingQueue
                    {
                        Id = Guid.NewGuid().ToString(),
                        PlayerId = player.Id,
                        QueeuedAt = DateTime.UtcNow,
                    });

                // Save changes to persist the new entry
                await context.SaveChangesAsync();

                // Prepare success response
                serviceResponse.Message = "Player added to the queue successfully";
                serviceResponse.Data = player.Id;
            }
            catch (Exception ex)
            {
                // Handle exceptions
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }

            return serviceResponse;
        }



        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(configuration["Jwt:AccessTokenExpirationMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(Convert.ToDouble(configuration["Jwt:RefreshTokenExpirationDays"])),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<ServiceResponse<string>> RefreshToken(string refreshToken)
        {
            var serviceResponse = new ServiceResponse<string>();
            serviceResponse.Success = false;

            var storedToken = await context.RefreshTokens.FindAsync(refreshToken);

            if (storedToken == null || storedToken.Expiration < DateTime.UtcNow)
            {
                serviceResponse.Message = "Invalid or expired refresh token.";
                return serviceResponse;
            }

            var player = await context.Users.FindAsync(storedToken.UserId);

            if (player == null)
            {
                serviceResponse.Message = "Unauthorized";
                return serviceResponse;
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, player.Id),
                new Claim(ClaimTypes.Name, player.UserName!),
            };

            var newAccessToken = GenerateAccessToken(claims);
            serviceResponse.Success = true;
            serviceResponse.Data = newAccessToken;
            return serviceResponse;
        }

    }

}
