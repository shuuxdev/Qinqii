using System.Data;
using Dapper;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Qinqii.Models;
using Qinqii.Models.Reaction;

namespace Qinqii.Service;

public class StoryService
{
    private readonly DapperContext _ctx;

    public StoryService(DapperContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<StoryDTO> GetStory(int story_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@story_id", story_id, DbType.Int32);
        var reader = await connection.QueryMultipleAsync(
            "[STORY].[Get]",
            commandType: CommandType.StoredProcedure, param: param);
        var story = await reader.ReadSingleAsync<StoryDTO>();
        var frames = (await reader.ReadAsync<StoryFrameDTO>()).ToList();
        var viewers = await reader.ReadAsync<FrameViewerDTO>();
        story.frames = frames.ToList();
        story.viewers = viewers.ToList();
        return story;
    }

    public async Task UpdateStoryViewer(int frame_id, int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@frame_id", frame_id, DbType.Int32);
        param.Add("@user_id", user_id, DbType.Int32);
        var dto = await connection.ExecuteAsync(
            "[STORY].[Update_Viewers]",
            commandType: CommandType.StoredProcedure, param: param);
    }
    public async Task DeleteStory(int story_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@story_id", story_id, DbType.Int32);
        var dto = await connection.ExecuteAsync(
            "[STORY].[Delete]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    
}