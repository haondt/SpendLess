using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public interface IStorage<TKey, TEntity>
    {
        public Task<TKey> CreateAsync(TEntity obj);
        public Task<IEnumerable<TKey>> CreateManyAsync(IEnumerable<TEntity> entities);
        public Task<bool> CreateAsync(TKey key, TEntity obj);
        public Task<(bool success, TEntity entity)> GetAsync(TKey key);
        public Task<Dictionary<TKey, TEntity>> GetManyAsync(IEnumerable<QueryParameter> parameters);
        public Task<bool> UpdateAsync(TKey key, TEntity obj);
        public Task<IEnumerable<bool>> UpdateManyAsync(Dictionary<TKey, TEntity> entities);
        public Task<bool> DeleteAsync(TKey key);
        public Task<IEnumerable<bool>> DeleteManyAsync(IEnumerable<TKey> keys);
        public Task<int> DeleteManyAsync(IEnumerable<QueryParameter> parameters);
    }
}
