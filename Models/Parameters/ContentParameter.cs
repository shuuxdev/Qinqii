using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public class ContentParameter: INotificationParameter
{
    public string name { get; set; } = "content";
    public string value { get; set; }
    
    public ContentParameter(string value) => this.value = value;
}