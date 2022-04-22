using Newtonsoft.Json;
using SpendLess.Storage.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage
{
    public class JsonFileStorage<TKey, TEntity> : IStorage<TKey, TEntity>
    {
        private readonly string fileName;
        private readonly Func<TKey> _keyGenerator;

        public JsonFileStorage(string fileName, Func<TKey> keyGenerator)
        {
            this.fileName = fileName;
            _keyGenerator = keyGenerator;
        }

        private void WriteData(Dictionary<TKey, TEntity> data)
        {
            File.WriteAllText(this.fileName, JsonConvert.SerializeObject(data));
        }

        private Dictionary<TKey, TEntity> ReadData()
        {
            using (var reader = new StreamReader(fileName))
                return JsonConvert.DeserializeObject<Dictionary<TKey, TEntity>>(reader.ReadToEnd());
        }

        public Task<TKey> CreateAsync(TEntity obj)
        {
            var data = ReadData();
            var id = _keyGenerator();
            data[id] = obj;
            WriteData(data);
            return Task.FromResult(id);
        }

        public Task<bool> CreateAsync(TKey key, TEntity obj)
        {
            var data = ReadData();
            if (data.ContainsKey(key))
                return Task.FromResult(false);
            data[key] = obj;
            WriteData(data);
            return Task.FromResult(true);
        }

        public Task<(bool success, TEntity entity)> GetAsync(TKey key)
        {
            var data = ReadData();
            if (data.TryGetValue(key, out var obj))
                return Task.FromResult((true, obj));
            return Task.FromResult((false, default(TEntity)));
        }

        public Task<bool> UpdateAsync(TKey key, TEntity obj)
        {
            var data = ReadData();
            if (data.ContainsKey(key))
            {
                data[key] = obj;
                WriteData(data);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public Task<bool> DeleteAsync(TKey key)
        {
            var data = ReadData();
            if (data.ContainsKey(key))
            {
                data.Remove(key);
                WriteData(data);
            }
            return Task.FromResult(false);
        }

        public Task<Dictionary<TKey, TEntity>> GetManyAsync(IEnumerable<QueryParameter> parameters)
        {

            var data = ReadData();
            var result = new Dictionary<TKey, TEntity>();
            foreach(var entry in data)
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

        public Task<IEnumerable<TKey>> CreateManyAsync(IEnumerable<TEntity> entities)
        {
            var data = ReadData();
            var keyedEntities = entities.ToDictionary(e => _keyGenerator(), e => e);
            foreach(var kvp in keyedEntities)
                data[kvp.Key] = kvp.Value;
            WriteData(data);
            return Task.FromResult(keyedEntities.Select(kvp => kvp.Key));
        }

        public Task<IEnumerable<bool>> UpdateManyAsync(Dictionary<TKey, TEntity> entities)
        {
            var data = ReadData();
            var result = entities.Select(e =>
            {
                if (data.ContainsKey(e.Key))
                {
                    data[e.Key] = e.Value;
                    return true;
                }
                return false;
            });
            WriteData(data);
            return Task.FromResult(result);
        }

        public Task<IEnumerable<bool>> DeleteManyAsync(IEnumerable<TKey> keys)
        {
            var data = ReadData();
            var result = keys.Select(k => data.Remove(k));
            WriteData(data);
            return Task.FromResult(result);
        }

        public async Task<int> DeleteManyAsync(IEnumerable<QueryParameter> parameters)
        {
            var data = ReadData();
            var entries = await GetManyAsync(parameters);
            var count = 0;
            foreach(var entry in entries)
            {
                if(data.Remove(entry.Key))
                    count ++;
            }
            WriteData(data);
            return count;
        }
    }
}
