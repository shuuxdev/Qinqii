
using Microsoft.AspNetCore.Mvc;
using Qinqii.Service;

namespace Qinqii.Controllers;
[Route("story")]
public class StoryController : ControllerBase
{
    private readonly StoryService _storyService;

    public StoryController(StoryService _storyService)
    {
        this._storyService = _storyService;
    }
    public async Task<IActionResult> GetStory(int id)
    {
        var story = await _storyService.GetStory(id);
        return Ok(story);
    }
    /*[HttpPatch]
    public async Task<IActionResult> UpdateViewer(int id)
    {
        var user_id = HttpContext.GetUserId();
        await _storyService.UpdateStoryViewer(id, user_id);
        return Ok();
    }*/
}
