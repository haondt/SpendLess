using Newtonsoft.Json;
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

    }
}
