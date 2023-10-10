namespace Qinqii.Models.QueryResult;

public class QueryResult
{
     public int rowCount { get; set; }
     public Exception? exception { get; set; }
     public string? message { get; set; }
     public bool isSucceed { get; set; }
     public QueryResult( int rowCount,bool isSucceed, string? message = null, Exception? exception = null)
     {
          this.rowCount = rowCount;
          this.isSucceed = isSucceed;
          this.message = message;
          this.exception = exception;
     }
}

public class QueryResult<T> : QueryResult
{
     public T? data { get; set; }
     
     public QueryResult(T data,  bool isSucceed, int rowCount = 0, string? message = null, Exception? exception = null) : base(rowCount, isSucceed, message, exception)
     {
          this.data = data;
     }
}