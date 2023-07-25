using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Qinqii.Enums;

namespace Qinqii.Models.Reaction;

public class SentReactionDTO
{
    // only for linking
    public int entity_id { get; set; }

    // only for linking
    public EntityType entity_type { get; set; }
    public int id { get; set; }
    public int reactor_id { get; set; }
    public string reactor_name { get; set; }

    public string emoji { get; set; }
    public string created_at { get; set; }
}