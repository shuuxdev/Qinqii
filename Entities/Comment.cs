using System.Net.Mail;
using System.Text.Json.Serialization;

public class Comment
{

    public int post_id { get; set; }
    [JsonPropertyName("id")]
    public int comment_id { get; set; }
    public string content { get; set; }
    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public int? parent_id { get; set; }
    public string created_at { get; set; }
    public List<Attachment> attachments { get; set; } = new();
    public List<Reaction> reactions { get; set; } = new();
}