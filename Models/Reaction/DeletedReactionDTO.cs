using Qinqii.Enums;

namespace Qinqii.Models.Reaction;

public class DeletedReactionDTO
{
    public int entity_id { get; set; }
    public EntityType entity_type { get; set; }
    public int id { get; set; }
}