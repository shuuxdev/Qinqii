using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public class ReactionIdParameter : INotificationParameter
{
    public string name { get; set; } = "reaction_id";
    public string value { get; set; }
    
    public ReactionIdParameter(string value) => this.value = value;
    
}