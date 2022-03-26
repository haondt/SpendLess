using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public class ThrowsExceptionStorage<TKey, TEntity>
    {
        private readonly IStorage<TKey, TEntity> _inner;

        public ThrowsExceptionStorage(IStorage<TKey, TEntity> inner)
        {
            _inner = inner;
        }

        public Task<TKey> CreateAsync(TEntity obj) => _inner.CreateAsync(obj);
        public async Task CreateAsync(TKey key, TEntity obj)
        {
            if (!await _inner.CreateAsync(key, obj))
                throw new InvalidOperationException();
        }

        public async Task<TEntity> GetAsync(TKey key)
        {
            var (success, entity) = await _inner.GetAsync(key);
            if (success)
                return entity;
            throw new KeyNotFoundException();
        }

        public async Task UpdateAsync(TKey key, TEntity obj) { 
            if (!await _inner.UpdateAsync(key, obj))
                throw new KeyNotFoundException();
        }

        public Task DeleteAsync(TKey key) => _inner.DeleteAsync(key);
    }
}
