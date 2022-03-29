using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Authentication.Abstractions
{
    public class AuthenticationTokenData
    {
        public string RefreshToken { get; set; }
        public string SessionToken { get; set; }
    }
}
