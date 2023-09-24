using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Qinqii.Models;
using Qinqii.Service;

namespace Qinqii.Controllers;

[Authorize]
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
    [HttpGet("feed")]

    public async Task<IActionResult> GetFeed()
    {
        var posts = await _feedService.GetAllPosts();
        var serializedData = JsonConvert.SerializeObject(posts);
        return new ContentResult
        {
            Content = serializedData,
            ContentType = "application/json",
            StatusCode = 200
        };
    }
    [HttpGet("stories")]
    public async Task<IActionResult> GetStories(CancellationToken token)
    {
        int user_id =  HttpContext.GetUserId();
        var stories = await _feedService.GetStories(token);
        return Ok(stories);
    }
}