using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using Minesweeper.Services.PlayerService;
using System.Security.Claims;

namespace Minesweeper.Controllers
{
    [Route("api/player")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerService playerService;
        private readonly UserManager<Player> playerManager;
        private readonly SignInManager<Player> signInManager;
        private readonly IMapper mapper;
        public PlayerController(
                UserManager<Player> playerManager,
                SignInManager<Player> signInManager,
                IMapper mapper,
                IPlayerService playerService
            )
        {
            this.playerService = playerService;
            this.playerManager = playerManager;
            this.signInManager = signInManager;
            this.mapper = mapper;
        }
        [HttpPost("register-user")]
        public async Task<IActionResult> Register(RegisterPlayerDTO newPlayer)
        {
            return Ok(await playerService.Register(newPlayer));
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginPlayerDTO player)
        {
            return Ok(await playerService.Login(player));
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            return Ok(await playerService.RefreshToken(refreshToken));
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
        [HttpPut("changePoints")]
        public async Task<IActionResult> ChangePoints(int pointsChange)
        {
            var playerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (playerId is null)
            {
                return BadRequest();
            }
            return Ok(await playerService.ChangePoints(playerId, pointsChange));
        }
    }
}
