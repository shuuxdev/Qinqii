using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Enums;


public class Reaction
{
    [JsonIgnore] public int entity_id { get; set; }
    [JsonIgnore] public string entity_type { get; set; }

    [JsonPropertyName("id")] public int id { get; set; } 
    [JsonPropertyName("reactor_id")] public int user_id { get; set; }
    public string reactor_name { get; set; }
    public string reactor_avatar { get; set; }
    public string emoji { get; set; }
    public string created_at { get; set; }
}