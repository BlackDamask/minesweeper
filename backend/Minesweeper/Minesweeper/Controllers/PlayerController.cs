using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;
using Minesweeper.Services.PlayerService;

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
        public async Task<IActionResult> Login(string username, string password)
        {
            return Ok(await playerService.Login(username, password));
        }
    }
}
