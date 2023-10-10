using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Qinqii.Enums;


public class Reaction
{
    [System.Text.Json.Serialization.JsonIgnore] public int entity_id { get; set; }
    [System.Text.Json.Serialization.JsonIgnore] public string entity_type { get; set; }

    [JsonPropertyName("id")]
    [JsonProperty("id")]
    public int reaction_id { get; set; } 
    public int reactor_id { get; set; }
    public string reactor_name { get; set; }
    public string reactor_avatar { get; set; }
    public string emoji { get; set; }
    public string created_at { get; set; }
}