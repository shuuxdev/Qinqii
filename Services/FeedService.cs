using System.Data;
using Dapper;
using Qinqii.Enums;
using Qinqii.Models;
using Qinqii.Models.Attachment;
using Qinqii.Models.Comment;
using Qinqii.Models.Post;
using Qinqii.Models.Reaction;

namespace Qinqii.Service;

public class FeedService
{
    private readonly DapperContext _ctx;

    public FeedService(DapperContext ctx)
    {
        _ctx = ctx;
    }

    
    public async Task<IEnumerable<PostDTO>> GetAllPosts()
    {
        // NOT EFFICENT, MIGHT FIX THIS IN THE FUTURE, TOO LAZY NOW
        Dictionary<int, PostDTO> postDictionary = new Dictionary<int, PostDTO>();
        Dictionary<int, CommentDTO> commentDictionary = new Dictionary<int, CommentDTO>();
        Dictionary<int, AttachmentDTO> attachmentDictionary = new Dictionary<int, AttachmentDTO>();
        Dictionary<int, ReactionDTO> reactionDictionary = new Dictionary<int, ReactionDTO>();
        using var connection = _ctx.CreateConnection();
        var param = new DynamicParameters();
         await connection.QueryAsync<PostDTO, AttachmentDTO, CommentDTO, ReactionDTO , PostDTO>(sql: "[POST].[GetAll]",  
(PostDTO post, AttachmentDTO attachment, CommentDTO comment, ReactionDTO reaction) =>
{
            
            PostDTO _post = null;
            CommentDTO commentDto = null;
            AttachmentDTO attachmentDto = null;
            ReactionDTO reactionDto = null;
            postDictionary.TryGetValue(post.post_id, out _post);
            if(attachment != null)
                attachmentDictionary.TryGetValue(attachment.attachment_id, out attachmentDto);
            if(comment != null)
                commentDictionary.TryGetValue(comment.comment_id, out commentDto);
            if(reaction != null)
                reactionDictionary.TryGetValue(reaction.reaction_id, out reactionDto);
            if (_post == null) postDictionary.Add(post.post_id, post);
            if(attachmentDto == null && attachment != null) attachmentDictionary.Add(attachment.attachment_id, attachment);
            if(commentDto == null && comment != null) commentDictionary.Add(comment.comment_id, comment);
            if(reactionDto == null && reaction != null) reactionDictionary.Add(reaction.reaction_id, reaction);
            return post;
        }, commandType: CommandType.StoredProcedure, param: param, splitOn:"attachment_id, comment_id, reaction_id" );

         var comments = commentDictionary.Values.Select((comment) =>
             {
                 comment.attachments.AddRange(attachmentDictionary.Values.Where((attachment) =>
                     attachment.entity_id == comment.comment_id && attachment.attachment_of == EntityType.Comment));
                 comment.reactions.AddRange(reactionDictionary.Values.Where((react) => 
                     react.entity_id == comment.comment_id && react.entity_type == EntityType.Comment));
                 return comment; // ok
             });
         var posts = postDictionary.Values.Select((post) =>
         {
             post.reactions.AddRange(reactionDictionary.Values.Where((react) =>
                 react.entity_id == post.post_id && react.entity_type == EntityType.Post));
             post.attachments.AddRange(attachmentDictionary.Values.Where((attachment) =>
                 attachment.entity_id == post.post_id && attachment.attachment_of == EntityType.Post));
             post.comments.AddRange(comments.Where(comment => comment.post_id == post.post_id));
             
             return post; // ok
         });
        return posts;
    }
}