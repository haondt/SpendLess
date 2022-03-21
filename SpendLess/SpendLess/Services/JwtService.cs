using SpendLess.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using SpendLess.Settings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SpendLess.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly AuthenticationSettings _authSettings;
        private readonly IClock _clock;

        public JwtService(IConfiguration configuration, AuthenticationSettings authSettings, IClock clock)
        {
            _configuration = configuration;
            _authSettings = authSettings;
            _clock = clock;
        }

        public string CreateAccessToken(string username, DateTime expiry)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                expires: _clock.UtcNow + TimeSpan.FromSeconds(_authSettings.AccessTokenExpirationSeconds),
                claims: new List<Claim> { new Claim(ClaimTypes.Name, username) },
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
             );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GetUsernameFromAccessToken(string accessToken)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(accessToken, tokenValidationParameters, out var securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal.Identity.Name;
        }
    }
}
