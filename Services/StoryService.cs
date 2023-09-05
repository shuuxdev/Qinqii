using System.Data;
using Dapper;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Qinqii.DTOs.Request.Story;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class StoryService
{
    private readonly DapperContext _ctx;

    public StoryService(DapperContext ctx)
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

    public async Task UpdateStoryViewerCount(UpdateStoryViewerCountRequest 
    request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        var dto = await connection.ExecuteAsync(
            "[STORY].[Update_Viewers]",
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