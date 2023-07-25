public static class ExceptionExtensions {
    public static string GetAllInnerExceptionMessages(this Exception e, List<string> list = null)
    {
        if(list == null)
        {
            list = new List<string>();
        }
        if(e != null)
        {
            list.Add(e.Message);
            GetAllInnerExceptionMessages(e.InnerException, list);    
        }
        return string.Join(Environment.NewLine, list);
    }
    
}