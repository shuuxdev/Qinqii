using System.Text.Json.Serialization;

namespace Qinqii.Models;

public class Friend
{
    
    [JsonPropertyName("id")]
    public int friend_id { get; set; }
    [JsonPropertyName("name")]
    public string friend_name { get; set; }
    [JsonPropertyName("avatar")]
    public string friend_avatar { get; set; }
}