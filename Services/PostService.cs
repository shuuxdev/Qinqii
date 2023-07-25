using System.Data;
using Dapper;
using Microsoft.AspNetCore.Components;
using Qinqii.Enums;
using Qinqii.Models;
using Qinqii.Models.Attachment;
using Qinqii.Models.Comment;
using Qinqii.Models.Post;
using Qinqii.Models.Reaction;

namespace Qinqii.Service;

public class PostService
{
    private readonly DapperContext _ctx;

    public PostService(DapperContext ctx)
    {
        _ctx = ctx;
    }

    public async Task<CommentDTO> EditComment(EditCommentDTO comment,
        int user_id)
    {
        var with_attachments = comment.attachments != null;
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@comment_id", comment.comment_id, DbType.Int32);
        param.Add("@user_id", user_id, DbType.Int32);
        param.Add("@content", comment.content, DbType.String);
        if (with_attachments)
        {
            var dt = new DataTable();
            dt.Columns.Add("attachment_id", typeof(int));
            dt.Columns.Add("attachment_link", typeof(string));
            dt.Columns.Add("attachment_type", typeof(string));
            dt.Columns.Add("action", typeof(string));

            comment.attachments.ForEach((att) =>
            {
                dt.Rows.Add(att.attachment_id, att.attachment_link,
                    att.attachment_type, att.action);
            });
            param.Add("@tvp", dt.AsTableValuedParameter());
        }

        var results = await connection.QueryMultipleAsync(
            "[dbo].[EDIT_Comment]",
            commandType: CommandType.StoredProcedure, param: param);

        var c = await results.ReadSingleAsync<CommentDTO>();
        var attachments = await results.ReadAsync<AttachmentDTO>();
        var reactions = await results.ReadAsync<ReactionDTO>();

        c.attachments = attachments.ToList();
        c.reactions = reactions.ToList();
        return c;
    }

    public async Task<CommentDTO> CreateComment(CreateCommentDTO comment,
        int user_id)
    {
        var with_attachments = comment.attachments != null;
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        if (with_attachments)
        {
            //Post có đính kèm tệp
            using var dt = new DataTable();
            dt.Columns.Add("url", typeof(string));
            dt.Columns.Add("type", typeof(string));
            comment.attachment_links.ForEach((att) =>
            {
                dt.Rows.Add(att.url, att.type);
            });
            param.Add("@tvp", dt.AsTableValuedParameter());
        }

        param.Add(@"post_id", comment.post_id, DbType.Int32);
        param.Add(@"with_attachments", with_attachments, DbType.Boolean);
        param.Add("@user_id", user_id, DbType.Int32);
        param.Add("@content", comment.content, DbType.String);
        param.Add("@parent_comment_id", comment.parent_comment_id,
            DbType.Int32);


        var results = await connection.QueryMultipleAsync(
            "[dbo].[CREATE_Comment]",
            commandType: CommandType.StoredProcedure, param: param);

        var c = await results.ReadSingleAsync<CommentDTO>();
        var att = await results.ReadAsync<AttachmentDTO>();
        if (att != null) c.attachments = att.ToList();
        return c;
    }

    public async Task DeleteComment(int comment_id, int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@comment_id", comment_id, DbType.Int32);
        param.Add("@user_id", user_id, DbType.Int32);
        await connection.ExecuteAsync("[dbo].[DELETE_Comment]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    public async Task EditPost(EditPostDTO post, int user_id)
    {
        var with_attachments = post.attachments != null;
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@post_id", post.post_id, DbType.Int32);
        param.Add("@user_id", user_id, DbType.Int32);
        param.Add("@content", post.content, DbType.String);
        if (with_attachments)
        {
            var dt = new DataTable();
            dt.Columns.Add("attachment_id", typeof(int));
            dt.Columns.Add("attachment_link", typeof(string));
            dt.Columns.Add("attachment_type", typeof(string));
            dt.Columns.Add("action", typeof(string));

            post.attachments.ForEach((att) =>
            {
                dt.Rows.Add(att.attachment_id, att.attachment_link,
                    att.attachment_type, att.action);
            });
            param.Add("@tvp", dt.AsTableValuedParameter());
        }

        await connection.ExecuteAsync("[dbo].[EDIT_Post]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    public async Task DeletePost(int post_id, int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@post_id", post_id, DbType.Int32);
        param.Add("@user_id", user_id, DbType.Int32);
        await connection.ExecuteAsync("[dbo].[DELETE_Post]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    public async Task CreatePost(CreatePostDTO post)
    {
        var with_attachments = post.attachments != null;
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        if (with_attachments)
        {
            //Post có đính kèm tệp
            using var dt = new DataTable();
            dt.Columns.Add("url", typeof(string));
            dt.Columns.Add("type", typeof(string));
            post.attachment_links.ForEach((att) =>
            {
                dt.Rows.Add(att.url, att.type);
            });
            param.Add("@tvp", dt.AsTableValuedParameter());
        }

        param.Add(@"with_attachments", with_attachments, DbType.Boolean);
        param.Add("@user_id", post.author, DbType.Int32);
        param.Add("@content", post.content, DbType.String);
        var u = await connection.ExecuteAsync("[dbo].[CREATE_Post]",
            commandType: CommandType.StoredProcedure, param: param);
    }

    public async Task<ReactionDTO> SendReact(SendReactionDTO reaction,
        int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@entity_id", reaction.entity_id, DbType.Int32);
        param.Add("@entity_type", reaction.entity_type, DbType.String);
        param.Add("@user_id", user_id, DbType.Int32);
        param.Add("@emoji", reaction.emoji, DbType.String);
        var dto = await connection.QuerySingleAsync<ReactionDTO>(
            "[dbo].[SEND_Reaction]",
            commandType: CommandType.StoredProcedure, param: param);
        return dto;
    }

    public async Task UndoReact(int id,
        int user_id)
    {
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
        param.Add("@user_id", user_id, DbType.Int32);
        param.Add("@reaction_id", id, DbType.Int32);
        var cnt = await connection.ExecuteAsync(
            "[dbo].[UNDO_Reaction]",
            commandType: CommandType.StoredProcedure, param: param);
        if (cnt != 1) throw new InvalidOperationException();
    }
}