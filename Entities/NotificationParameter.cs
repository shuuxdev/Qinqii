


using System.Text.Json.Serialization;
using Qinqii.Models.Attributes;

public class NotificationParameter
{
    [JsonIgnore]
    public int notification_id { get; set; }
    public string param_name { get; set; }
    public string param_value { get; set; }
}