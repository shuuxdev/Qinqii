namespace Qinqii.Models.Reaction;

public class SendReactionDTO
{
    public int user_id { get; set; }
    public int entity_id { get; set; }
    public string entity_type { get; set; }
    public string emoji { get; set; }
    
    
}