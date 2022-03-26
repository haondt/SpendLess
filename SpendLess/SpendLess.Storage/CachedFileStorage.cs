using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public class CachedFileStorage<TKey, TEntity> : IStorage<TKey, TEntity>
    {
        private readonly INestableStorage<TKey, TEntity> _inner;
        private readonly IMemoryCache _memoryCache;
        private readonly MemoryCacheSettings _memoryCacheSettings;

        public CachedFileStorage(INestableStorage<TKey, TEntity> inner, IMemoryCache memoryCache, IOptions<MemoryCacheSettings> options)
        {
            _inner = inner;
            _memoryCache = memoryCache;
            _memoryCacheSettings = options.Value;
        }

        public async Task<TKey> CreateAsync(TEntity obj)
        {
            var id = await _inner.CreateAsync(obj);
            _memoryCache.Set(id, obj, TimeSpan.FromSeconds(_memoryCacheSettings.MemoryCacheExpirationSeconds));
            return id;
        }

        public async Task<bool> CreateAsync(TKey key, TEntity obj)
        {
            if(await _inner.CreateAsync(key, obj))
            {
                _memoryCache.Set(key, obj, TimeSpan.FromSeconds(_memoryCacheSettings.MemoryCacheExpirationSeconds));
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteAsync(TKey key)
        {
            if (await _inner.DeleteAsync(key))
            {
                _memoryCache.Remove(key);
                return true;
            }
            return false;
        }

        public async Task<(bool success, TEntity entity)> GetAsync(TKey key)
        {
            if (_memoryCache.TryGetValue(key, out var obj) && obj is TEntity tObj)
                return (true, tObj);
            else
            {
                var value = await _inner.GetAsync(key);
                if(value.success)
                {
                    _memoryCache.Set(key, value.entity, TimeSpan.FromSeconds(_memoryCacheSettings.MemoryCacheExpirationSeconds));
                    return (true, value.entity);
                }
            }
            return (false, default(TEntity));
        }

        public async Task<bool> UpdateAsync(TKey key, TEntity obj)
        {
            if (await _inner.UpdateAsync(key, obj))
            {
                _memoryCache.Set(key, obj, TimeSpan.FromSeconds(_memoryCacheSettings.MemoryCacheExpirationSeconds));
                return true;
            }
            return false;
        }
    }
}
