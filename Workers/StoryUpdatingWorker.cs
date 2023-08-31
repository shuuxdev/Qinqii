using System.Data;
using Dapper;
using Qinqii.Models;
using Qinqii.Service;

namespace Qinqii.Workers;

public class StoryUpdatingWorker : BackgroundService
{
    private readonly ILogger<StoryUpdatingWorker> _logger;
    private readonly IServiceProvider _serviceProvider;

    public StoryUpdatingWorker( ILogger<StoryUpdatingWorker> logger, 
    IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }
    protected  override async  Task ExecuteAsync(CancellationToken 
    stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            
            /*_logger.LogInformation("Worker running at: {time} ({counter})", DateTimeOffset.Now);
            using( var scope = _serviceProvider.CreateScope())
            {
                var feed = scope.ServiceProvider
                .GetRequiredService<FeedService>();
                var storyService = scope.ServiceProvider
                    .GetRequiredService<StoryService>();
                var stories = await feed.GetStories(stoppingToken);
                stories.ForEach(async (story) =>
                {
                    var now = DateTime.Now;
                    if (story.created_at.Add(TimeSpan.FromHours(story.expire_after))
                     <= 
                    now)
                    {
                        await storyService.DeleteStory(story.story_id);
                    }
                });
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);  
            }*/
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);  

            //GetRequiredService throw exception when no such service was registered
            //GetService returns null;
              
        }

    }
}
