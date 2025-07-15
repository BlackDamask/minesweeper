using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using Minesweeper.data;
using Minesweeper.DTOs.PlayerDTO;

using Minesweeper.models;
using Minesweeper.Services.EmailService;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.EntityFrameworkCore;

namespace Minesweeper.Services.AuthenticationService
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<Player> playerManager;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;
        private readonly IEmailService emailService;
        private readonly ILogger<AuthenticationService> logger;

        public AuthenticationService(
            UserManager<Player> playerManager,
            IMapper mapper,
            IConfiguration configuration,
            ApplicationDbContext context,
            IEmailService emailService,
            ILogger<AuthenticationService> logger)
        {
            this.playerManager = playerManager;
            this.mapper = mapper;
            this.configuration = configuration;
            this.context = context;
            this.emailService = emailService;
            this.logger = logger;
        }

        private async Task<ServiceResponse<LoginPlayerResponseDTO>> CreateGuest()
        {
            var serviceResponse = new ServiceResponse<LoginPlayerResponseDTO>();

            try
            {
                Random random = new Random();
                int number = random.Next(10000, 99999);
                string guestName = "Guest_" + number;

                var player = new Player
                {
                    IsGuest = true,
                    UserName = guestName,
                    PlayerName = guestName,
                    Email = $"guest_{number}@guest.minesweeper.com",
                    EmailConfirmed = true,
                };

                var result = await playerManager.CreateAsync(player);

                if (!result.Succeeded)
                {
                    var errorDescriptions = string.Join("; ", result.Errors.Select(e => e.Description));
                    logger.LogError("Failed to create guest player: {Errors}", errorDescriptions);

                    serviceResponse.Success = false;
                    serviceResponse.Message = "Failed to create guest player";
                    return serviceResponse;
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, player.Id),
                    new Claim(ClaimTypes.Name, player.UserName!)
                };

                var accessToken = GenerateAccessToken(claims);
                var refreshToken = GenerateRefreshToken(claims);

                context.RefreshTokens.Add(new RefreshToken
                {
                    Token = refreshToken,
                    UserId = player.Id,
                    Expiration = DateTime.UtcNow.AddDays(Convert.ToDouble(configuration["Jwt:RefreshTokenExpirationDays"]))
                });

                await context.SaveChangesAsync();

                serviceResponse.Success = true;
                serviceResponse.Data = new LoginPlayerResponseDTO
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error during guest creation.");
                serviceResponse.Success = false;
                serviceResponse.Message = "An error occurred while creating a guest.";
            }

            return serviceResponse;
        }


        public async Task<ServiceResponse<LoginPlayerResponseDTO>> Login(LoginPlayerDTO player)
        {
            if (player.IsGuest)
            {
                return await CreateGuest();
            }
            var serviceResponse = new ServiceResponse<LoginPlayerResponseDTO>();
            var loggedPlayer = await playerManager.FindByEmailAsync(player.Email!);
            if (loggedPlayer == null)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "User not found";
                return serviceResponse;
            }
            if (!await playerManager.IsEmailConfirmedAsync(loggedPlayer))
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Email is not confirmed";
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

            var existingPlayer = await playerManager.FindByEmailAsync(newPlayer.Email);
            if (existingPlayer != null)
            {
                serviceResponse.Message = "This email is already in use. Please choose another email.";
                serviceResponse.Success = false;
                return serviceResponse;
            }

            var existingName = await context.Users
                .FirstOrDefaultAsync(p => p.PlayerName == newPlayer.PlayerName);
            if (existingName != null)
            {
                serviceResponse.Message = "This player name is already taken. Please choose another name.";
                serviceResponse.Success = false;
                return serviceResponse;
            }

            var player = mapper.Map<Player>(newPlayer);

            var result = await playerManager.CreateAsync(player, newPlayer.Password);

            if (result.Succeeded)
            {
                var token = await playerManager.GenerateEmailConfirmationTokenAsync(player);
                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                var confirmationLink = $"http://localhost:5150/api/player/confirm-email?userId={player.Id}&token={encodedToken}";

                if (emailService == null)
                    throw new Exception("emailService is null");
                if (player == null)
                    throw new Exception("player is null");
                if (string.IsNullOrEmpty(player.Email))
                    throw new Exception("player.Email is null or empty");

                await emailService.SendEmailAsync(player.Email, "Confirm Your Email",
                $@"
                <div style='font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;'>
                    <div style='max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;'>
                        <h2 style='color: #2d7ff9; text-align: center;'>Welcome to Minesweeper Battle!</h2>
                        <p style='font-size: 16px; color: #333; text-align: center;'>
                            Thank you for registering.<br>
                            Please confirm your email address to activate your account.
                        </p>
                        <div style='text-align: center; margin: 32px 0;'>
                            <a href='{confirmationLink}' 
                            style='background: #2d7ff9; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-size: 16px; display: inline-block;'>
                                Confirm Email
                            </a>
                        </div>
                        <p style='font-size: 13px; color: #888; text-align: center;'>
                            If you did not create an account, you can safely ignore this email.
                        </p>
                    </div>
                </div>
                ");

                serviceResponse.Message = "Registration succeeded! Please check your email for confirmation.";
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

        private string GenerateAccessToken(IEnumerable<Claim> claims)
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

        private string GenerateRefreshToken(IEnumerable<Claim> claims)
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

    }
}
