
using Qinqii.Models.Attributes;

public class DeletePostRequest
{
    [ParameterName("post_id")]
    public int id { get; set; }
    public int user_id { get; set; }
}