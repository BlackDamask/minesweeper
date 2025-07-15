using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using Minesweeper.Services.AuthenticationService;
using Minesweeper.Services.PlayerService;
using System.Security.Claims;
using System.Text;

namespace Minesweeper.Controllers
{
    [Route("api/player")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerService playerService;
        private readonly UserManager<Player> playerManager;
        private readonly IAuthenticationService authenticationService; 
        private readonly SignInManager<Player> signInManager;
        private readonly IMapper mapper;
        public PlayerController(
                UserManager<Player> playerManager,
                SignInManager<Player> signInManager,
                IMapper mapper,
                IPlayerService playerService,
                IAuthenticationService authenticationService
            )
        {
            this.playerService = playerService;
            this.playerManager = playerManager;
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.authenticationService = authenticationService;
        }

        // --- POST methods (alphabetically) ---
        [Authorize]
        [HttpPost("add-to-queue")]
        public async Task<IActionResult> AddToQueue()
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
            {
                return BadRequest();
            }
            return Ok(await playerService.AddPlayerToQueue(playerId));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginPlayerDTO player)
        {
            return Ok(await authenticationService.Login(player));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            return Ok(await authenticationService.RefreshToken(refreshToken));
        }

        [HttpPost("register-user")]
        public async Task<IActionResult> Register(RegisterPlayerDTO newPlayer)
        {
            return Ok(await authenticationService.Register(newPlayer));
        }

        // --- GET methods (alphabetically) ---
        [HttpGet("app-version")]
        public IActionResult AppVersion()
        {
            return Ok("1.0.1");
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPlayers()
        {
            return Ok(await playerService.GetAllPlayers());
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            var user = await playerManager.FindByIdAsync(userId);
            if (user == null) return BadRequest("Invalid user");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

            var result = await playerManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded) return BadRequest("Email confirmation failed");

            var html = @"
                <html>
                <head>
                    <title>Email Confirmed</title>
                </head>
                <body style='font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;'>
                    <div style='max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px; text-align: center;'>
                        <h2 style='color: #2d7ff9;'>Email Confirmed!</h2>
                        <p style='font-size: 16px; color: #333;'>
                            Your email has been successfully confirmed.<br>
                            You can now log in to your account.
                        </p>
                        <a href='http://localhost:3000' 
                           style='background: #2d7ff9; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-size: 16px; display: inline-block; margin-top: 24px;'>
                            Go to Minesweeper Battle Website
                        </a>
                    </div>
                </body>
                </html>
            ";

            return Content(html, "text/html");
        }

        [Authorize]
        [HttpGet("friends")]
        public async Task<IActionResult> GetFriends()
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
                return BadRequest();
            return Ok(await playerService.GetFriends(playerId));
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(playerId is null)
            {
                return BadRequest();
            }
            return Ok(await playerService.GetProfile(playerId));
        }

        [Authorize]
        [HttpGet("search")]
        public async Task<IActionResult> SearchPlayers([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest("Search term is required.");

            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
                return BadRequest();

            return Ok(await playerService.SearchPlayersByName(name, playerId));
        }

        // --- PUT methods ---
        [Authorize]
        [HttpPut("change-username")]
        public async Task<IActionResult> ChangeUsername(string userName)
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
            {
                return BadRequest();
            }
            return Ok(await playerService.ChangeUserName(playerId, userName));
        }

        // --- DELETE methods (alphabetically) ---
        [Authorize]
        [HttpDelete("remove-friend")]
        public async Task<IActionResult> RemoveFriend([FromQuery] string friendId)
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
                return BadRequest();

            var result = await playerService.RemoveFriend(playerId, friendId);
            if (result.Success)
                return Ok(result);
            return BadRequest(result);
        }

        [Authorize]
        [HttpDelete("remove-from-queue")]
        public async Task<IActionResult> RemoveFromQueue()
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
            {
                return BadRequest();
            }
            return Ok(await playerService.RemovePlayerFromQueue(playerId));
        }
    }
}
