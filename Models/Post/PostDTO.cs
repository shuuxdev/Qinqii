using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Qinqii.Models.Attachment;
using Qinqii.Models.Comment;
using Qinqii.Models.Reaction;

namespace Qinqii.Models.Post;


public class PostDTO
{
   
    [JsonPropertyName("id")]
    public int post_id { get; set; }
    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public string content { get; set; }
    public string created_at { get; set; }

    public List<ReactionDTO> reactions { get; set; } = new();
    public List<CommentDTO> comments { get; set; } = new();
    public List<AttachmentDTO> attachments { get; set; } = new();
}
