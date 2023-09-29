namespace Qinqii.Models.Exceptions;

public class AlreadyFriendException : Exception
{
    public AlreadyFriendException() : base("You are already friends with this user.") { }
}