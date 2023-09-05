using System.Data;
using System.Dynamic;
using Dapper;
using Qinqii.Enums;
using Qinqii.Extensions;
using Qinqii.Models;

namespace Qinqii.Service;

public class FeedService
{
    private readonly DapperContext _ctx;

    public FeedService(DapperContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task<List<StoryThumbnail>> GetStories(
    CancellationToken token)
    {
         using var connection = _ctx.CreateConnection();

        
        var param = new DynamicParameters();
        //param.Add("@user_id", user_id, DbType.Int32);
        var reader = await connection.QueryMultipleAsync("[STORY].GetAll",
            commandType: CommandType.StoredProcedure, param: param);

        var stories = (await reader.ReadAsync<StoryThumbnail>()).ToList();
        return stories;
    }
    public async Task<IEnumerable<Post>> GetAllPosts() 
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        var reader = await connection.QueryMultipleAsync("[POST].GetAll",
            commandType: CommandType.StoredProcedure, param: param);
                
        var posts = await reader.ToPosts();
        return posts;       
    }
}