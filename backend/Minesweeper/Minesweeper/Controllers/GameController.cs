using Microsoft.AspNetCore.Mvc;
using Minesweeper.Services.GameService;

namespace Minesweeper.Controllers
{
    [Route("api/game")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameService gameService;
        public GameController(IGameService gameService)
        {
            this.gameService = gameService;
        }

    }
}