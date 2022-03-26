using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
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
    public class LoginController : BaseController
    {
        private readonly IAuthenticationService _authService;
        private readonly IClock _clock;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPrincipalService _principalService;
        private readonly AuthenticationSettings _authSettings;

        public LoginController(IAuthenticationService authService, IOptions<AuthenticationSettings> authOptions, IClock clock, IHttpContextAccessor httpContextAccessor,
            IPrincipalService principalService)
        {
            _authService = authService;
            _clock = clock;
            _httpContextAccessor = httpContextAccessor;
            _principalService = principalService;
            _authSettings = authOptions.Value;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] UserAuthenticationDto authenticationDto)
        {
            authenticationDto.Username = authenticationDto.Username.ToLowerInvariant();
            var (success, tokenData) = await _authService.TryAuthenticateUserAsync(authenticationDto);
            if (success)
            {
                SetRefreshTokenCookie(tokenData.RefreshToken);
                return new OkObjectResult(tokenData.SessionToken);
            }

            return new UnauthorizedResult(); 
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            if (_principalService.TryGetRefreshToken(out var token))
                if (await _authService.TryRevokeUserAsync(token))
                    return new OkResult();
            return new UnauthorizedResult();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDto registrationDto)
        {
            registrationDto.Username = registrationDto.Username.ToLowerInvariant();
            var (success, usernameAvailable, tokenData) = await _authService.TryRegisterUserAsync(registrationDto);
            if (success)
            {
                SetRefreshTokenCookie(tokenData.RefreshToken);
                return new OkObjectResult(tokenData.SessionToken);
            }
            else if (!usernameAvailable)
                return new ConflictResult();
            return new BadRequestResult();
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            if (_principalService.TryGetRefreshToken(out var token))
            {
                var (success, newTokenData) = await _authService.TryRefreshSessionTokenAsync(token);

                if (success)
                {
                    SetRefreshTokenCookie(newTokenData.RefreshToken);
                    return new OkObjectResult(newTokenData.SessionToken);
                }
            }

            return new UnauthorizedResult();
        }

        private void SetRefreshTokenCookie(string token)
        {
            _httpContextAccessor.HttpContext.Response.Cookies.Append(_authSettings.RefreshTokenCookieName, token, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true,
                Expires = _clock.UtcNow + TimeSpan.FromSeconds(_authSettings.RefreshTokenExpirationSeconds)
            });
        }

    }
}
