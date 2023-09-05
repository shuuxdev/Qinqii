using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public class FriendRequestIdParameter : INotificationParameter
{
    public string name { get; set; } = "request_id";
    public string value { get; set; }
    
    public FriendRequestIdParameter(string value) => this.value = value;
}