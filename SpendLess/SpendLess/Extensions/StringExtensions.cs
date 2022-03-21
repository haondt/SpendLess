using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace SpendLess.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        ///
        /// </summary>
        /// https://stackoverflow.com/questions/11454004/calculate-a-md5-hash-from-a-string?rq=1#comment104361781_38471020
        /// <param name="source"></param>
        /// <param name="hash"></param>
        /// <returns></returns>
        public static string Hash(this string source, MD5 hash)
        {
            return string.Concat(hash.ComputeHash(Encoding.UTF8.GetBytes(source)).Select(x => x.ToString("x2")));
        }
        public static string Hash2(this string source, MD5 hash)
        {
            return Convert.ToBase64String(
                hash.ComputeHash(Encoding.UTF8.GetBytes(source)));
        }

    }
}
