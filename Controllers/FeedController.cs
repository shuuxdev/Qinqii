using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Models;
using Qinqii.Service;

namespace Qinqii.Controllers;

[Authorize]
[Route("feed")]
public class FeedController : ControllerBase
{
    private readonly FeedService _feedService;
    private readonly ILogger<FeedController> _logger;
    private readonly IWebHostEnvironment _env;


    public FeedController(FeedService feedService, ILogger<FeedController> logger, IWebHostEnvironment env)
    {
        _feedService = feedService;
        _logger = logger;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeed()
    {
        int user_id = HttpContext.GetUserId();
        var posts = await _feedService.GetAllPosts();
        return new JsonResult(posts);
    }
}