

using Qinqii.Models.Attributes;

public class EditCommentRequest
{
    public int user_id { get; set; }
    public int comment_id { get; set; }
    [IgnoreDapperParameter]
    public List<AttachmentUpdateTVP> attachments { get; set; } = new();
    public string content { get; set; }
    
}