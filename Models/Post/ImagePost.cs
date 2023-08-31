using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Qinqii.Enums;

namespace Qinqii.Models.Post;

public class ImagePost
{
    [JsonPropertyName("id")]
    public int attachment_id { get; set; }
    
    public int entity_id { get; set; }
    public EntityType entity_type { get; set; }
    
    public int attachment_link { get; set; }
}