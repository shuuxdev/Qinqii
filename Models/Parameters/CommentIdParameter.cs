using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public  class CommentIdParameter : INotificationParameter
{
    public string name { get; set; } = "comment_id";
    public string value { get; set; }
    
    public CommentIdParameter(string value) => this.value = value;
}