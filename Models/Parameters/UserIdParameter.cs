using Qinqii.Models.Interfaces;

namespace Qinqii.Controllers;

public class UserIdParameter : INotificationParameter
{
    public string name { get; set; } = "user_id";
    public string value { get; set; }
    
    public UserIdParameter(string value) => this.value = value;
}