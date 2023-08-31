using System.Net.Mail;
using System.Text.Json.Serialization;
using Qinqii.Models.Attachment;
using Qinqii.Models.Reaction;

namespace Qinqii.Models.Comment;

public class CommentDTO
{
    public CommentDTO()
    {
        reactions = new List<ReactionDTO>();
        attachments = new List<AttachmentDTO>();
    }

    //[JsonIgnore]
    public int post_id { get; set; }
    [JsonPropertyName("id")] public int comment_id { get; set; }
    public string content { get; set; }

    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public string created_at { get; set; }
    public int? parent_id { get; set; }
    public List<AttachmentDTO> attachments { get; set; }
    public List<ReactionDTO> reactions { get; set; }
}