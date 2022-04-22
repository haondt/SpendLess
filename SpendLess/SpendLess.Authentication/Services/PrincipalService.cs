using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using SpendLess.Authentication.Abstractions;
using SpendLess.Authentication.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Authentication.Services
{
    public class PrincipalService : IPrincipalService
    {
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AuthenticationSettings _authSettings;

        public PrincipalService(IJwtService jwtService, IHttpContextAccessor httpContextAccessor, IOptions<AuthenticationSettings> authOptions)
        {
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _authSettings = authOptions.Value;
        }

        public string GetUsername()
        {
            if (TryGetSessionToken(out var tokenData))
            {
                return _jwtService.GetUsernameFromAccessToken(tokenData);
            }
            throw new UnauthorizedAccessException();
        }

        public bool TryGetRefreshToken(out string token)
        {
            return _httpContextAccessor.HttpContext.Request.Cookies.TryGetValue(_authSettings.RefreshTokenCookieName, out token);
        }

        public bool TryGetSessionToken(out string token)
        {
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out var accessTokenValues);
            token = accessTokenValues.FirstOrDefault()?.Split(" ")?.LastOrDefault() ?? string.Empty;
            return !string.IsNullOrEmpty(token);
        }
    }
}
