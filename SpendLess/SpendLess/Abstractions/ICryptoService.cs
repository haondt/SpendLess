using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions
{
    public interface ICryptoService
    {
        public string Hash(string plainText, string salt);
        public string GenerateSalt();
        public string GenerateRefreshToken();
    }
}
