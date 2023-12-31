using System.Data;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Qinqii.DTOs.Request.Comment;
using Qinqii.Extensions;
using Qinqii.Models;
using Qinqii.Utilities;

namespace Qinqii.Service;

public class CommentRepository  
{
    private DapperContext _ctx;
    public CommentRepository(DapperContext ctx)
    {
        _ctx = ctx;
    }


    public async Task<Comment> EditComment(EditCommentRequest comment)
    {
        using var connection = _ctx.CreateConnection();
        var param = comment.ToParameters();
        if (comment.attachments.Count > 0)
        {
            var dt = comment.attachments.ToTableValuedParameters(); 
            param.Add("@tvp", dt);
        }

        var results = await connection.QueryMultipleAsync(
            "[COMMENT].[Edit]",
            commandType: CommandType.StoredProcedure, param: param);

        var c = await results.ReadSingleAsync<Comment>();
        var _attachments = await results.ReadAsync<Attachment>();
        var _reactions = await results.ReadAsync<Reaction>();

        c.attachments = _attachments.ToList();
        c.reactions = _reactions.ToList();
        return c;
    }
    public async Task<Comment> GetComment(GetCommentRequest comment)
    {
        using var connection = _ctx.CreateConnection();
        var param = comment.ToParameters();
        var results = await connection.QueryMultipleAsync(
            "[COMMENT].[Get]",
            commandType: CommandType.StoredProcedure, param: param);

        var c = await results.ReadSingleAsync<Comment>();
        var attachments = await results.ReadAsync<Attachment>();
        var reactions = await results.ReadAsync<Reaction>();
        c.attachments = attachments.ToList();
        c.reactions = reactions.ToList();
        return c;
    }

    public async Task<Comment> CreateComment(CreateCommentRequest comment,
        int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = comment.ToParameters();
        if (comment.attachments != null)
        {
           var tvp = comment.attachment_links.ToTableValuedParameters();
            param.Add("@tvp", tvp);
        }
        var results = await connection.QueryMultipleAsync(
            "[COMMENT].[Create]",
            commandType: CommandType.StoredProcedure, param: param);

        var c = await results.ReadSingleAsync<Comment>(); 
        var att = await results.ReadAsync<Attachment>();
        c.attachments = att.ToList();
        return c;
    }

    public async Task<int> GetCommentAuthorId(int comment_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@comment_id", comment_id);
        var author_id = await connection.QuerySingleAsync<int>(
            "[COMMENT].[GetAuthor]",
            commandType: CommandType.StoredProcedure, param: param);
        return author_id;
    }
    public async Task DeleteComment(DeleteCommentRequest comment)
    {
        using var connection = _ctx.CreateConnection();
        var param = comment.ToParameters();
        await connection.ExecuteAsync("[COMMENT].[Delete]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    public async Task<int> GetPostIdByCommentId(int comment_id)
    { 
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@comment_id", comment_id);
        var post_id = await connection.QuerySingleAsync<int>(
            "[COMMENT].[GetPostIdByCommentId]",
            commandType: CommandType.StoredProcedure, param: param);
        return post_id;
    }
    public async Task<IEnumerable<Comment>> GetCommentsByPostId(GetCommentsOfPostRequest request)
    {
        using var connection = _ctx.CreateConnection();
        var param = request.ToParameters();
        
        var reader = await connection.QueryMultipleAsync(
            "[COMMENT].[GetByPostId]",
            commandType: CommandType.StoredProcedure, param: param);
        var comments = await reader.ToComments();
        return comments;
    }
}