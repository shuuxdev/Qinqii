using System.Collections;

namespace Qinqii.DTOs.Response.Message;

public class CreateMessageResponse
{
    public string message_text { get; set; }
    public int sender_id { get; set; }
    public int conversation_id { get; set; }
    public DateTime? sent_at { get; set; }
    public int recipient_id { get; set; }
    public int message_id { get; set; }
    public IEnumerable<Attachment> attachments { get; set; }
    public IEnumerable<Reaction> reactions { get; set; }
    
}