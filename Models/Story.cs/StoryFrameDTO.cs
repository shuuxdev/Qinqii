using Qinqii.Models.Reaction;

namespace Qinqii.Models;

public class StoryFrameDTO
{

    public int id { get; set; }
    public int story_id { get; set; }
    public string frame_type { get; set; }
    public string frame_url { get; set; }
    public int duration { get; set; }
    
}