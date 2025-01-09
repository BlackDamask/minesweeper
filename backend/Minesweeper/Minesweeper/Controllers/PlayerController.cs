using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using Minesweeper.Services.AuthenticationService;
using Minesweeper.Services.PlayerService;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;

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
        [HttpPost("register-user")]
        public async Task<IActionResult> Register(RegisterPlayerDTO newPlayer)
        {
            return Ok(await authenticationService.Register(newPlayer));
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
        [HttpPut("change-points")]
        public async Task<IActionResult> ChangePoints(int pointsChange)
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
            {
                return BadRequest();
            }
            return Ok(await playerService.ChangePoints(playerId, pointsChange));
        }
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
