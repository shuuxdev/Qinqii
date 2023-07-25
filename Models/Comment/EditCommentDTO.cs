using Qinqii.Models.Attachment;

namespace Qinqii.Models.Comment;

public class EditCommentDTO
{
    public int comment_id { get; set; }
    public List<AttachmentUpdateTVP> attachments { get; set; }
    public string content { get; set; }
    
}