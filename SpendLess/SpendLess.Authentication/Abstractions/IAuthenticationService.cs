using SpendLess.Domain.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Authentication.Abstractions
{
    public interface IAuthenticationService
    {
        public Task<(bool success, AuthenticationTokenData newTokenData)> TryRefreshSessionTokenAsync(string refreshToken);

        public Task<(bool success, AuthenticationTokenData tokenData)> TryAuthenticateUserAsync(UserAuthenticationDto authenticationDto);

        public Task<bool> TryRevokeUserAsync(string refreshToken);

        public Task<(bool success, bool usernameAvailable, AuthenticationTokenData tokenData)> TryRegisterUserAsync(UserRegistrationDto registrationDto);
    }
}
