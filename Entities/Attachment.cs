using System.Text.Json.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Qinqii.Enums;

public class Attachment
{
    [Newtonsoft.Json.JsonIgnore]
    [System.Text.Json.Serialization.JsonIgnore]
    public string entity_type { get; set; }
    [Newtonsoft.Json.JsonIgnore]
    [System.Text.Json.Serialization.JsonIgnore]
    public int entity_id { get; set; }
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public int attachment_id { get; set; }
    [JsonPropertyName("link")]
    [JsonProperty("link")]

    public string attachment_link { get; set; }
    [JsonPropertyName("type")]
    [JsonProperty("type")]
    [System.Text.Json.Serialization.JsonConverter(typeof(JsonStringEnumConverter))]
    [Newtonsoft.Json.JsonConverter(typeof(StringEnumConverter))]
    public AttachmentType attachment_type { get; set; }
    
    
}