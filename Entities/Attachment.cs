using System.Text.Json.Serialization;
using Qinqii.Enums;

public class Attachment
{
    [JsonIgnore]
    public string entity_type { get; set; }
    [JsonIgnore]
    public int entity_id { get; set; }
    [JsonPropertyName("id")]
    public int attachment_id { get; set; }
    [JsonPropertyName("link")]
    public string attachment_link { get; set; }
    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public AttachmentType attachment_type { get; set; } 
}