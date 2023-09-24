public class Contact
{
    IEnumerable<Message> messages;

    public int conversation_id { get; set; }
    public string conversation_default_emoji { get; set; }

    public int recipient_id { get; set; }

    public string recipient_name { get; set; }

    public string recipient_avatar { get; set; }

    public OnlineStatus? online_status { get; set; }
}
public enum OnlineStatus
{
    ONLINE,
    OFFLINE
}