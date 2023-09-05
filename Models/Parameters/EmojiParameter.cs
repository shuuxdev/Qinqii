using Qinqii.Models.Interfaces;

namespace Qinqii.Models.Parameters;

public class EmojiParameter: INotificationParameter
{
    public string name { get; set; } = "emoji";
    public string value { get; set; }
    
    public EmojiParameter(string value) => this.value = value;
}