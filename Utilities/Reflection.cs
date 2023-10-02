namespace Qinqii.Utilities;

public static class Reflection
{
    public static bool CheckIfEnumerable(Type type)
    {
        foreach (var @interface in type.GetInterfaces())
        {
            if (@interface.Namespace.StartsWith("System.Collections"))
                return true;
        }
        return false;
    }
}