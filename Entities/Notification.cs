using System.Text.Json.Serialization;

public class Notification
{
    [JsonPropertyName("id")]public int notification_id { get; set; }
    public int user_id { get; set; }
    
    [JsonPropertyName("type")]public string notification_type { get; set; }

    [JsonPropertyName("params")]
    public Dictionary<string, string>
        notification_params { get; set; } = new();

    [JsonPropertyName("timestamp")]public string created_at { get; set; }
    
    public int actor_id { get; set; }
    
    public string actor_name { get; set; }
    
    public string actor_avatar { get; set; }
    
    public bool read { get; set; }    
    
}
