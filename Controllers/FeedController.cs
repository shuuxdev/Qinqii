using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Qinqii.Models;
using Qinqii.Models.Paging;
using Qinqii.Repositories;
using Qinqii.Service;
using PostRepository = Qinqii.Repositories.PostRepository;
using StoryRepository = Qinqii.Repositories.StoryRepository;

namespace Qinqii.Controllers;

[Authorize]
public class FeedController : ControllerBase
{
    private readonly FeedRepository _feedRepository;
    private readonly StoryRepository _storyRepository;
    private readonly PostRepository _postRepository;
    private readonly ILogger<FeedController> _logger;
    private readonly IWebHostEnvironment _env;


    public FeedController(FeedRepository feedRepository, StoryRepository storyRepository,  PostRepository postRepository, ILogger<FeedController> logger, IWebHostEnvironment env)
    {
        _feedRepository = feedRepository;
        _storyRepository = storyRepository;
        _postRepository = postRepository;
        _logger = logger;
        _env = env;
    }
    [HttpGet("feed")]

    public async Task<IActionResult> GetFeed()
    {
        //var posts = await _feedService.GetAllPosts();
        var posts = await _feedRepository.GetAllPosts();
        var serializedData = JsonConvert.SerializeObject(posts);
        return new ContentResult
        {
            Content = serializedData,
            ContentType = "application/json",
            StatusCode = 200
        };
    }
    [HttpGet("stories")]
    public async Task<IActionResult> GetStories(Page page,CancellationToken token)
    {
        int user_id =  HttpContext.GetUserId();
        var stories = await _feedRepository.GetStories(page, user_id, token);
        return Ok(stories);
    }
}