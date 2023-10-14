using System.Data;
using Dapper;
using Qinqii.DTOs.Request.Story;
using Qinqii.Models;
using Qinqii.Service;

namespace Qinqii.Workers;

public class StoryUpdatingWorker : BackgroundService
{
    private readonly ILogger<StoryUpdatingWorker> _logger;
    private readonly IServiceProvider _serviceProvider;

    public StoryUpdatingWorker(ILogger<StoryUpdatingWorker> logger,
    IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    protected override async Task ExecuteAsync(CancellationToken
    stoppingToken)
    {
        var scope = _serviceProvider.CreateScope();
        var storyService = scope.ServiceProvider
            .GetRequiredService<StoryRepository>();
        while (!stoppingToken.IsCancellationRequested)
        {

            //_logger.LogInformation("Worker running at: {time} ({counter})", DateTimeOffset.Now);

            var stories = await storyService.GetAllStories(stoppingToken);
            stories.ToList().ForEach(async (story) =>
            {
                var now = DateTime.Now;
                if (story.created_at.Add(TimeSpan.FromHours(story.expire_after))
                    <=
                    now)
                {
                    await storyService.DeleteStory(new DeleteStoryRequest() { story_id = story.story_id });
                }
            });
            await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);
            //GetRequiredService throw exception when no such service was registered
            //GetService returns null;
        }
    }
}
