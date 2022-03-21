using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public interface INestableStorage<TKey, TEntity>
    {
        public Task<TKey> Create(TEntity obj);
        public Task<bool> Create(TKey key, TEntity obj);
        public Task<(bool success, TEntity entity)> Get(TKey key);
        public Task<bool> Update(TKey key, TEntity obj);
        public Task<bool> Delete(TKey key);
    }
}
