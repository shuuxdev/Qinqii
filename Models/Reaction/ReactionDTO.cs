using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Enums;

namespace Qinqii.Models.Reaction;

public class ReactionDTO
{
    [JsonIgnore]

    // only for post
    [BindProperty(Name = "post_id")]
    public int entity_id { get; set; }

    [JsonIgnore] public EntityType entity_type { get; set; }

    [JsonPropertyName("id")] 
    public int reaction_id { get; set; }
    public int reactor_id { get; set; }
    public string reactor_name { get; set; }
    public string reactor_avatar { get; set; }
    public string emoji { get; set; }
    public string created_at { get; set; }
}