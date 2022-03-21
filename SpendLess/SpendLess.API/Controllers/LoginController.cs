using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using SpendLess.Abstractions;
using SpendLess.API.ExceptionFilters;
using SpendLess.Domain.Dtos;
using SpendLess.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SameSiteMode = Microsoft.AspNetCore.Http.SameSiteMode;

namespace SpendLess.API.Controllers
{
    [ApiController]
    [Authorize]
    [ExceptionFilter(typeof(Exception), 500)]
    [Route("")]
    public class LoginController
    {
        private readonly IAuthenticationService _authService;
        private readonly IClock _clock;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AuthenticationSettings _authSettings;

        public LoginController(IAuthenticationService authService, IOptions<AuthenticationSettings> authOptions, IClock clock, IHttpContextAccessor httpContextAccessor)
        {
            _authService = authService;
            _clock = clock;
            _httpContextAccessor = httpContextAccessor;
            _authSettings = authOptions.Value;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] UserAuthenticationDto authenticationDto)
        {
            var (success, tokenData) = await _authService.TryAuthenticateUserAsync(authenticationDto);
            if (success)
            {
                SetRefreshTokenCookie(tokenData.RefreshToken);
                return new OkObjectResult(tokenData.AccessToken);
            }

            return new UnauthorizedResult(); 
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            if (TryGetAuthenticationTokenData(out var tokenData))
                if (await _authService.TryRevokeUserAsync(tokenData))
                    return new OkResult();
            return new UnauthorizedResult();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
        {
            var (success, usernameAvailable, tokenData) = await _authService.TryRegisterUserAsync(registrationDto);
            if (success)
            {
                SetRefreshTokenCookie(tokenData.RefreshToken);
                return new OkObjectResult(tokenData.AccessToken);
            }
            else if (!usernameAvailable)
                return new ConflictResult();
            return new BadRequestResult();
        }


        [HttpPost]
        [AllowAnonymous]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            if (TryGetAuthenticationTokenData(out var tokenData))
            {
                var (success, newTokenData) = await _authService.TryRefreshAccessTokenAsync(tokenData);

                if (success)
                {
                    SetRefreshTokenCookie(tokenData.RefreshToken);
                    return new OkObjectResult(newTokenData.AccessToken);
                }
            }

            return new UnauthorizedResult();
        }

        private bool TryGetAuthenticationTokenData(out AuthenticationTokenData tokenData)
        {
            if (_httpContextAccessor.HttpContext.Request.Cookies.TryGetValue(_authSettings.RefreshTokenCookieName, out var refreshToken))
            {
                if (!string.IsNullOrEmpty(refreshToken))
                {
                    _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(HeaderNames.Authorization, out var accessTokenValues);
                    var accessToken = accessTokenValues.FirstOrDefault();
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        tokenData = new AuthenticationTokenData
                        {
                            AccessToken = accessToken,
                            RefreshToken = refreshToken
                        };

                        return true;
                    }
                }
            }

            tokenData = null;
            return false;
        }

        private void SetRefreshTokenCookie(string token)
        {
            _httpContextAccessor.HttpContext.Response.Cookies.Append(_authSettings.RefreshTokenCookieName, token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = true,
                Expires = _clock.UtcNow + TimeSpan.FromSeconds(_authSettings.RefreshTokenExpirationSeconds)
            });
        }

    }
}
