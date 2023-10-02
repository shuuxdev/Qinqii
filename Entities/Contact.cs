public class Contact
{
    public IEnumerable<Message> messages { get; set; } = new List<Message>();

    public int conversation_id { get; set; }
    public string conversation_default_emoji { get; set; }

    public int recipient_id { get; set; }

    public string recipient_name { get; set; }

    public string recipient_avatar { get; set; }

    public OnlineStatus? online_status { get; set; }
    
    public int unread_messages { get; set; }
    
    public DateTime? last_message_sent_at { get; set; }
    
    public string? last_message { get; set; }
    
    public int? last_message_sender_id { get; set; }
}
public enum OnlineStatus
{
    ONLINE,
    OFFLINE
}