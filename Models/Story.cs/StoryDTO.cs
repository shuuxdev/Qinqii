using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Qinqii.Models;

public class StoryDTO
{
    public StoryDTO()
    {
        frames = new List<StoryFrameDTO>();
        viewers = new List<FrameViewerDTO>();
    }
    
    [JsonPropertyName("id")]
    public int story_id { get; set; }
    public int author_id { get; set; }
    public string author_name { get; set; }
    public string author_avatar { get; set; }
    public List<StoryFrameDTO> frames { get; set; }
    public List<FrameViewerDTO> viewers { get; set; }

    public DateTime created_at { get; set; }
    public int expire_after { get; set; }
}