using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Authentication.Abstractions
{
    public interface IJwtService
    {
        public string CreateAccessToken(string username, DateTime expiry);

        public string GetUsernameFromAccessToken(string accessToken);
    }
}
