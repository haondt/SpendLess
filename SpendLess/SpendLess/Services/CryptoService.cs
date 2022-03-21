using SpendLess.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Services
{
    public class CryptoService : ICryptoService
    {
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string GenerateSalt()
        {
            var randomNumber= new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string Hash(string plainText, string salt)
        {
            var plainTextBytes = Convert.FromBase64String(plainText);
            var saltBytes = Convert.FromBase64String(salt);
            var plainTextWithSaltBytes =  plainTextBytes.Concat(saltBytes).ToArray();
            var hash = SHA256.Create().ComputeHash(plainTextWithSaltBytes);
            return Convert.ToBase64String(hash);
        }
    }
}
