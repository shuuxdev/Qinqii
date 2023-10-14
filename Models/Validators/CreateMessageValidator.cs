using FluentValidation;
using Qinqii.DTOs.Request.Message;
using Qinqii.Models;
using Qinqii.Models.Attachments;

namespace Qinqii.Models.Validators;

public class CreateMessageValidator : AbstractValidator<CreateMessageRequest>
{
    public CreateMessageValidator(List<VideoAttachment> videos, List<ImageAttachment> images)
    {
        RuleFor(x => x.sender_id).NotEmpty().WithMessage("Sender id is required");
        RuleFor(x => x.conversation_id).NotEmpty().WithMessage("Conversation id is required");
        RuleFor(x => x.recipient_id).NotEmpty().WithMessage("Recipient id is required");
        RuleFor(x => x.message_text).NotEmpty().WithMessage("Thiếu nội dung tin nhắn").When(x => videos.Count == 0 && images.Count == 0);
    }
}