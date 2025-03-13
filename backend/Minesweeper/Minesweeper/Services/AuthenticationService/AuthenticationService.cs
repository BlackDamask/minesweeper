using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using Minesweeper.data;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using Minesweeper.Services.EmailService;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace Minesweeper.Services.AuthenticationService
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<Player> playerManager;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;
        private readonly IEmailService emailService;

        public AuthenticationService(
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
            var loggedPlayer = await playerManager.FindByEmailAsync(player.Email);
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
            var player = mapper.Map<Player>(newPlayer);

            var result = await playerManager.CreateAsync(player, newPlayer.Password);
            if (result.Succeeded)
            {
                var token = await playerManager.GenerateEmailConfirmationTokenAsync(player);

                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                var confirmationLink = $"https://localhost:7036/api/auth/confirm-email?userId={player.Id}&token={encodedToken}";

                await emailService.SendEmailAsync(player.Email, "Confirm Your Email",
                    $"Please confirm your email by clicking <a href='{confirmationLink}'>here</a>.");

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
