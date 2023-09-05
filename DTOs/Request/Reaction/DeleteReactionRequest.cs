using Qinqii.Models.Attributes;

namespace Qinqii.DTOs.Request.Reaction;

public class DeleteReactionRequest
{
    [ParameterName("reaction_id")]
    public int id { get; set; }
    public int user_id { get; set; }
}