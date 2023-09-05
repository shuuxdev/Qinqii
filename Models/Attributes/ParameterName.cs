namespace Qinqii.Models.Attributes;

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
public class ParameterName : Attribute
{
    public string Name { get; set; }

    public ParameterName(string Name)
    {
        this.Name = Name;
    }
}