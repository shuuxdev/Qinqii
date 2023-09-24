namespace Qinqii.Models.Exceptions;

public class NoAttachmentUploadedException : Exception
{
    public NoAttachmentUploadedException() : base("No attachment uploaded")
    {
    }
}