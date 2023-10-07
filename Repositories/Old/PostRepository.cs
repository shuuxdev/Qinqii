using System.Data;
using Dapper;
using Qinqii.Models;
using Qinqii.Models.Interfaces;
using Qinqii.Models.Paging;
using Qinqii.Models.TableValuedParameter;
using Qinqii.Utilities;

namespace Qinqii.Repositories;

public class PostRepository : IRepository<Post>
{
    private readonly QueryHelper _query;

    public PostRepository(QueryHelper query)
    {
        _query = query;
    }
    public Task<Post> GetById(int id)
    {
       
       throw new NotImplementedException();
    }

    public Task<IEnumerable<Post>> GetAll(Page page)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<Post>> GetAll()
    {
        return  _query.QueryMultipleAsync<IEnumerable<Post>>("[POST].[GetAll]", null);
    }
    
    public async Task<Post> Create(Post post, List<AttachmentId> attachmentIds)
    {
        var param = post.ToParameters();
            param.Add("@tvp", attachmentIds.ToTableValuedParameters());
        var result = await _query.QuerySingleAsync<Post>("[POST].[Create]", param);
        return result;
    }
    public Task<Post> Create(Post entity)
    {
        throw new NotImplementedException();
    }

    public Task<Post> Update(Post entity)
    {
        throw new NotImplementedException();
    }

    public Task<Post> Delete(int id)
    {
        throw new NotImplementedException();
    }
}