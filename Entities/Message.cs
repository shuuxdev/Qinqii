using Newtonsoft.Json;

public class Message
{

    public int message_id { get; set; }

    public string message_text { get; set; }
    public int sender_id { get; set; }
    public int conversation_id { get; set; }

    public DateTime? sent_at { get; set; }

    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
    public int recipient_id { get; set; }
}