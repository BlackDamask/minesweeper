using Microsoft.AspNetCore.Mvc;
using Minesweeper.Services.RequestService;

namespace Minesweeper.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RequestController : ControllerBase
{
    private readonly IRequestService requestService;

    public RequestController(IRequestService requestService)
    {
        this.requestService = requestService;
    }

    [HttpPost("friend")]
    public async Task<IActionResult> CreateFriendRequest([FromQuery] string playerId, [FromQuery] string requestingPlayerId)
    {
        var result = await requestService.CreateFriendRequest(playerId, requestingPlayerId);
        if (result.Success)
            return Ok(result);
        return BadRequest(result);
    }
}