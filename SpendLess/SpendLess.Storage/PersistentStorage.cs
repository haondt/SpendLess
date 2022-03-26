using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public class PersistentStorage<TKey, TEntity> : IStorage<TKey, TEntity>
    {
        private readonly Dictionary<TKey, TEntity> _storage = new Dictionary<TKey, TEntity>();
        private readonly Func<TKey> _keyGenerator;

        public PersistentStorage(Func<TKey> keyGenerator)
        {
            _keyGenerator = keyGenerator;
        }
        
        public Task<TKey> CreateAsync(TEntity obj)
        {
            var id = _keyGenerator();
            _storage.Add(id, obj);
            return Task.FromResult(id);
        }

        public Task<bool> CreateAsync(TKey key, TEntity obj)
        {
            if (_storage.ContainsKey(key))
                return Task.FromResult(false);
            _storage.Add(key, obj);
            return Task.FromResult(true);
        }

        public Task<bool> DeleteAsync(TKey key)
        {
            return Task.FromResult(_storage.Remove(key));
        }

        public Task<(bool success, TEntity entity)> GetAsync(TKey key)
        {
            if (_storage.TryGetValue(key, out var obj))
                return Task.FromResult((true, obj));
            return Task.FromResult((false, default(TEntity)));
        }

        public Task<bool> UpdateAsync(TKey key, TEntity obj)
        {
            if (_storage.ContainsKey(key))
            {
                _storage[key] = obj;
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
    }
}
