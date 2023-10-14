using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Qinqii.Entities;
public class Post
{
   
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int post_id { get; set; }
    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public string content { get; set; }
    public string created_at { get; set; }

    public int total_comments { get; set; }
    public List<Reaction> reactions { get; set; } = new();
    public List<Comment> comments { get; set; } = new();
    public List<Attachment> attachments { get; set; } = new();
    
}
