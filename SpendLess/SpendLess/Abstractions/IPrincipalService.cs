using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions
{
    public interface IPrincipalService
    {
        public string GetUsername();
        public bool TryGetSessionToken(out string token);
        public bool TryGetRefreshToken(out string token);
    }
}
