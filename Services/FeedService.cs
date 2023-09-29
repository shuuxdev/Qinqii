using System.Data;
using System.Dynamic;
using Dapper;
using Qinqii.Enums;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Models.Paging;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class FeedService
{
    private readonly DapperContext _ctx;

    public FeedService(DapperContext ctx)
    {
        _ctx = ctx;
    }
    
    public async Task<IEnumerable<Story>> GetStories(Page page, int user_id,
    CancellationToken token)
    {
         using var connection = _ctx.CreateConnection();

        
        var param = page.ToParameters();
        param.Add("@user_id", user_id, DbType.Int32);
        var reader = await connection.QueryMultipleAsync("[STORY].GetAll",
            commandType: CommandType.StoredProcedure, param: param);

        var stories = await reader.ToStories();
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