using Qinqii.Models.Attributes;

namespace Qinqii.DTOs.Request.Comment;

public class DeleteCommentRequest
{
    [ParameterName("comment_id")]
    public int id { get;set; }
    public int user_id { get; set; }
}