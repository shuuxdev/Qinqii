using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public class PostIdParameter : INotificationParameter
{
    public string name { get; set; } = "post_id";
    public string value { get; set; }
    
    public PostIdParameter(string value) => this.value = value;
}