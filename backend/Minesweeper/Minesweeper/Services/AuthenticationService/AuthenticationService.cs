using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Minesweeper.data;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Minesweeper.Services.AuthenticationService
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly UserManager<Player> playerManager;
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext context;

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
