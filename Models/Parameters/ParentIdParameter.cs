using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public class ParentIdParameter : INotificationParameter
{
    public string name { get; set; } = "parent_id";
    public string value { get; set; }
    
    public ParentIdParameter(string value) => this.value = value;
}