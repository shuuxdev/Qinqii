

using Qinqii.Models.Attributes;

public class EditCommentRequest
{
    public int user_id { get; set; }
    public int comment_id { get; set; }
    [IgnoreDapperParameter]
    public List<AttachmentUpdateTVP> attachments { get; set; } = new();
    [IgnoreDapperParameter]
    public List<IFormFile> new_attachments { get; set; }
    [IgnoreDapperParameter]
    public List<int> deleted_attachments { get; set; }

    public string content { get; set; }
    
}

