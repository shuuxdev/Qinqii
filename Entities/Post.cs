using System.Text.Json.Serialization;
using Newtonsoft.Json;


public class Post
{
   
    [JsonPropertyName("id")]
    public int post_id { get; set; }
    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public string content { get; set; }
    public string created_at { get; set; }

    public List<Reaction> reactions { get; set; } = new();
    public List<Comment> comments { get; set; } = new();
    public List<Attachment> attachments { get; set; } = new();
}
