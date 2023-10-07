using System.Data;
using Dapper;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Qinqii.DTOs.Request.Story;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class StoryRepository
{
    private readonly DapperContext _ctx;

    public StoryRepository(DapperContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<Story> GetStory(GetStoryRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var reader = await connection.QueryMultipleAsync(
            "[STORY].[Get]",
            commandType: CommandType.StoredProcedure, param: param);
        var story = await reader.ReadSingleAsync<Story>();
        var frames = (await reader.ReadAsync<Frame>()).ToList();
        var viewers = await reader.ReadAsync<FrameViewer>();
        story.frames = frames.ToList();
        story.viewers = viewers.ToList();
        return story;
    }
    public async Task<IEnumerable<Story>> GetAllStories(CancellationToken token)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        var stories = await connection.QueryAsync<Story>("[STORY].GetAllStoriesForBackgroundService",
            commandType: CommandType.StoredProcedure, param: param);

        return stories;
    }
    public async Task UpdateStoryViewerCount(UpdateStoryViewerCountRequest 
    request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var dto = await connection.ExecuteAsync(
            "[STORY].[Update_Viewers]",
            commandType: CommandType.StoredProcedure, param: param);
    }
    public async Task CreateStory(CreateStoryRequest request, IEnumerable<AttachmentIdsTVP> attachment_ids)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        param.Add("@attachment_ids", attachment_ids.ToTableValuedParameters());
        var dto = await connection.ExecuteAsync(
            "[STORY].[Create]",
            commandType: CommandType.StoredProcedure, param: param);
    }
    public async Task DeleteStory(DeleteStoryRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var dto = await connection.ExecuteAsync(
            "[STORY].[Delete]",
            commandType: CommandType.StoredProcedure, param: param);
    }
}