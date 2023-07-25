using System.Text.Json.Serialization;
using Qinqii.Enums;

namespace Qinqii.Models.Attachment;

public class AttachmentDTO
{
    [JsonIgnore]
    public EntityType attachment_of { get; set; }
    [JsonIgnore]
    public int entity_id { get; set; }
    [JsonPropertyName("id")]
    public int attachment_id { get; set; }
    [JsonPropertyName("link")]
    public string attachment_link { get; set; }
    [JsonPropertyName("type")]
    public AttachmentType attachment_type { get; set; } 
}