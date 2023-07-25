using Microsoft.AspNetCore.Mvc;
using Qinqii.Models.Reaction;
using Qinqii.Service;

namespace Qinqii.Controllers;

//this is the controller for all the fucking actions that you have no ideas where should you put it -.-
[ApiController]
public class GlobalController : ControllerBase
{
    private readonly PostService _postService;

    public GlobalController(PostService postService)
    {
        _postService = postService;
    }

    [HttpPatch("react")]
    public async Task<IActionResult> SendReaction(
        [FromBody] SendReactionDTO reaction)
    {
        var user_id = HttpContext.GetUserId();
        var dto = await _postService.SendReact(reaction, user_id);
        return Ok(dto);
    }
    
    [HttpDelete("undo-react")]
    public async Task<IActionResult> UndoReaction(
        int id)
    {
        var user_id = HttpContext.GetUserId();
        await _postService.UndoReact(id, user_id);
        return Ok();
    }
}