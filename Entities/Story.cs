using System.Text.Json.Serialization;
using Newtonsoft.Json;


public class Story
{
    
    [JsonPropertyName("id")]
    public int story_id { get; set; }
    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public string thumbnail { get; set; }
    public List<Frame> frames { get; set; } = new();
    public List<FrameViewer> viewers { get; set; } = new();
    
    public bool seen { get; set; }
    public DateTime created_at { get; set; }
    public int expire_after { get; set; }
}