using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public interface INestableStorage<TKey, TEntity>
    {
        public Task<TKey> CreateAsync(TEntity obj);
        public Task<bool> CreateAsync(TKey key, TEntity obj);
        public Task<(bool success, TEntity entity)> GetAsync(TKey key);
        public Task<bool> UpdateAsync(TKey key, TEntity obj);
        public Task<bool> DeleteAsync(TKey key);
    }
}
