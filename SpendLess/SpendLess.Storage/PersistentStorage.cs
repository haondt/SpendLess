using SpendLess.Storage.Extensions;
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

        public async Task<IEnumerable<TKey>> CreateManyAsync(IEnumerable<TEntity> entities)
        {
            return await Task.WhenAll(entities.Select(async e => await CreateAsync(e)));
        }

        public Task<bool> DeleteAsync(TKey key)
        {
            return Task.FromResult(_storage.Remove(key));
        }

        public async Task<IEnumerable<bool>> DeleteManyAsync(IEnumerable<TKey> keys)
        {
            return await Task.WhenAll(keys.Select(async k => await DeleteAsync(k)));
        }

        public async Task<int> DeleteManyAsync(IEnumerable<QueryParameter> parameters)
        {
            var entitiesToDelete = await GetManyAsync(parameters);
            return (await Task.WhenAll(entitiesToDelete.Select(async kvp => await DeleteAsync(kvp.Key)))).Length;
        }

        public Task<(bool success, TEntity entity)> GetAsync(TKey key)
        {
            if (_storage.TryGetValue(key, out var obj))
                return Task.FromResult((true, obj));
            return Task.FromResult((false, default(TEntity)));
        }

        public Task<Dictionary<TKey,TEntity>> GetManyAsync(IEnumerable<QueryParameter> parameters)
        {
            var result = new Dictionary<TKey,TEntity>();
            foreach(var entry in _storage)
            {
                foreach(var parameter in parameters)
                {

                    if(entry.Value.TryGetProperty(parameter.PropertyKey, out var value))
                    {
                        if (parameter.PerformComparison(value))
                        {
                            result[entry.Key] = entry.Value;
                        }
                    }
                }
            }
            return Task.FromResult(result);
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

        public async Task<IEnumerable<bool>> UpdateManyAsync(Dictionary<TKey, TEntity> entities)
        {
            return await Task.WhenAll(entities.Select(async kvp => await UpdateAsync(kvp.Key, kvp.Value)));
        }
    }
}
