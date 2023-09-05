using System.Data;
using Dapper;
using Microsoft.AspNetCore.Components;
using Qinqii.DTOs.Request.Comment;
using Qinqii.DTOs.Request.Reaction;
using Qinqii.Enums;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class PostService
{
    private readonly DapperContext _ctx;

    public PostService(DapperContext ctx)
    {
        _ctx = ctx;
    }


    public async Task EditPost(EditPostRequest post)
    {
        using var connection = _ctx.CreateConnection();
        var param = post.ToParameters();
        if ( post.attachments != null)
        {
            var dt = post.attachments.ToTableValuedParameters();
            param.Add("@tvp", dt);
        }

        await connection.ExecuteAsync("[POST].[Edit]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    public async Task DeletePost(DeletePostRequest post)
    {
        using var connection = _ctx.CreateConnection();
        var param = post.ToParameters();
        await connection.ExecuteAsync("[POST].[Delete]",
            commandType: CommandType.StoredProcedure, param: param);
    }
    
    public async Task CreatePost(CreatePostRequest post,CancellationToken token)
    {
        using var connection = _ctx.CreateConnection();
        var param = post.ToParameters();
        if (post.attachments != null)
        {
            //Post có đính kèm tệp
             var dt = post.attachment_links.ToTableValuedParameters();
            param.Add("@tvp", dt);
        }
        
        var cmd = new CommandDefinition(commandType: CommandType
                .StoredProcedure, commandText: "[POST].[Create]",
            parameters: param, cancellationToken:token);
        var u = await connection.ExecuteAsync(cmd);
    }

   
    
    public async Task<int> GetPostAuthorId(int post_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@post_id", post_id);
        var author_id = await connection.QuerySingleAsync<int>(
            "[POST].[GetAuthor]",
            commandType: CommandType.StoredProcedure, param: param);
        return author_id;
    }
    
    public async Task<Reaction> SendReact(CreateReactionRequest createReaction)
    {
        using var connection = _ctx.CreateConnection();
        var param = createReaction.ToParameters();
        var reaction = await connection.QuerySingleAsync<Reaction>(
            "[REACTION].[Create]",
            commandType: CommandType.StoredProcedure, param: param);
        
        return reaction;
    }
    public async Task UndoReact(DeleteReactionRequest react)
    {
        using var connection = _ctx.CreateConnection();
        var param = react.ToParameters();
        var cnt = await connection.ExecuteAsync(
            "[REACTION].[Delete]",
            commandType: CommandType.StoredProcedure, param: param);
        if (cnt != 1) throw new InvalidOperationException();
    }
}