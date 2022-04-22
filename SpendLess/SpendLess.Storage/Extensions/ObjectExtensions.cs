using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Storage.Extensions
{
    public static class ObjectExtensions
    {
        public static bool TryGetProperty(this object obj, List<string> propertyKey, out object property)
        {
            if (propertyKey.Count == 0)
            {
                property = obj;
                return true;
            }

            var prop = obj.GetType().GetProperty(propertyKey.First());
            if (prop != null)
            {
                var value = prop.GetValue(obj);
                return value.TryGetProperty(propertyKey.Skip(1).ToList(), out property);
            }

            property = null;
            return false;
        }

    }
}
