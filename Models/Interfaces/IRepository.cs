using Qinqii.Models.Paging;

namespace Qinqii.Models.Interfaces;

public interface IRepository<T> 
{
    public Task<T> GetById(int id);
    public Task<IEnumerable<T>> GetAll(Page page);
    public Task<IEnumerable<T>> GetAll();
    public Task<T> Create(T entity);
    public Task<T> Update(T entity);
    public Task<T> Delete(int id);
}