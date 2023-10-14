using FluentValidation;
namespace Qinqii.Models.Validators.Post;

public class PostValidator : AbstractValidator<Entities.Post>
{
    public PostValidator()
    {
        RuleFor(x => x.content).NotEmpty().WithMessage("Content cannot be empty");
        RuleFor(x => x.content).MaximumLength(1000).WithMessage("Content cannot be longer than 1000 characters");
    }
}