public class ConnectionNotFoundException : Exception
{
    public ConnectionNotFoundException() : base("Connection not found")
    {
        
    }

    public ConnectionNotFoundException(string message)
        : base(message)
    {
    }

    public ConnectionNotFoundException(string message, Exception inner)
        : base(message, inner)
    {
    }
}