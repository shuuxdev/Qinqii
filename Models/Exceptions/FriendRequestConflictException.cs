namespace Qinqii.Models.Exceptions;

public class FriendRequestConflictException : Exception
{
    public FriendRequestConflictException() : base("Friend request already sent")
    {
        
    }
}