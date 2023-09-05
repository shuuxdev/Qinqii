using System.Text.Json.Serialization;
using Newtonsoft.Json;

//this is for display the story thumbnail 
public class StoryThumbnail
{
    
    [JsonPropertyName("id")]
    public int story_id { get; set; }
    public string thumbnail { get; set; }
    public string author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public DateTime created_at { get; set; }
    public int expire_after { get; set; }
}