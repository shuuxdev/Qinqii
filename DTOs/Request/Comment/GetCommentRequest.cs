using Qinqii.Models.Attributes;

namespace Qinqii.Service;

public class GetCommentRequest
{
    [ParameterName("comment_id")]
    public int id { get; set; }
}