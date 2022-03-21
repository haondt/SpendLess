using Microsoft.Extensions.Options;
using SpendLess.Abstractions;
using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using SpendLess.Settings;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IStorage<string, RefreshTokenData> _refreshTokenStorage;
        private readonly IStorage<string, User> _userStorage;
        private readonly ICryptoService _cryptoService;
        private readonly IClock _clock;
        private readonly IJwtService _jwtService;
        private readonly AuthenticationSettings _authenticationSettings;

        public AuthenticationService(
            IStorage<string, RefreshTokenData> refreshTokenStorage,
            IStorage<string, User> userStorage,
            ICryptoService cryptoService,
            IOptions<AuthenticationSettings> authenticationOptions,
            IClock clock,
            IJwtService jwtService)
        {
            _refreshTokenStorage = refreshTokenStorage;
            _userStorage = userStorage;
            _cryptoService = cryptoService;
            _clock = clock;
            _jwtService = jwtService;
            _authenticationSettings = authenticationOptions.Value;
        }



        public async Task<(bool success, AuthenticationTokenData tokenData)> TryAuthenticateUserAsync(UserAuthenticationDto authenticationDto)
        {
            var username = authenticationDto.Username.ToLower();
            if (!string.IsNullOrEmpty(username))
            {
                var (success, entity) = await _userStorage.Get(username);
                if (success)
                {
                    var hashedPass = _cryptoService.Hash(authenticationDto.Password, entity.PasswordSalt);
                    if (entity.PasswordHash.Equals(hashedPass))
                    {
                        var refreshTokenValue = _cryptoService.GenerateRefreshToken();
                        var refreshTokenData = new RefreshTokenData
                        {
                            Expiry = _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.RefreshTokenExpirationSeconds),
                            IsValid = true,
                            Username = username
                        };
                        
                        if (await _refreshTokenStorage.Create(refreshTokenValue, refreshTokenData))
                        {
                            return (true, new AuthenticationTokenData
                            {
                                RefreshToken = refreshTokenValue,
                                AccessToken = _jwtService.CreateAccessToken(username, 
                                    _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.AccessTokenExpirationSeconds))
                            });
                        }
                        else
                        {
                            throw new Exception("Collision encountered when generating refresh token");
                        }
                    }
                }
            }
            return (false, null);
        }


        public async Task<(bool success, AuthenticationTokenData newTokenData)> TryRefreshAccessTokenAsync(AuthenticationTokenData tokenData)
        {
            var username = _jwtService.GetUsernameFromAccessToken(tokenData.AccessToken).ToLower();
            if (!string.IsNullOrEmpty(username))
            {
                var (success, entity) = await _refreshTokenStorage.Get(tokenData.RefreshToken);
                if (success && entity.IsValid && entity.Expiry > _clock.UtcNow)
                {
                    var newRefreshToken = _cryptoService.GenerateRefreshToken();
                    var newRefreshTokenData = new RefreshTokenData
                    {
                        Expiry = entity.Expiry,
                        Username = username,
                        IsValid = true
                    };

                    if (!await _refreshTokenStorage.Create(newRefreshToken, newRefreshTokenData))
                    {
                        if(!await _refreshTokenStorage.Delete(tokenData.RefreshToken))
                            if (!await _refreshTokenStorage.Update(tokenData.RefreshToken, new RefreshTokenData
                            {

                                Expiry = entity.Expiry,
                                IsValid = false,
                                Username = username
                            }))
                            {
                                if (! await _refreshTokenStorage.Delete(newRefreshToken))
                                    throw new Exception("Unable to invalidate new refresh token");
                                throw new Exception("Unable to invalidate old refresh token");
                            }
                        throw new Exception("Collision encountered when generating refresh token");
                    }
                    else
                    {
                        return (true, new AuthenticationTokenData
                        {
                            RefreshToken = newRefreshToken,
                            AccessToken = _jwtService.CreateAccessToken(username, 
                                _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.AccessTokenExpirationSeconds))
                        });
                    }
                }
            }
            return (false, null);
        }

        public async Task<(bool success, bool usernameAvailable, AuthenticationTokenData tokenData)> TryRegisterUserAsync(UserRegistrationDto registrationDto)
        {
            var username = registrationDto.Username.ToLower();
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(registrationDto.Password))
            {
                var salt = _cryptoService.GenerateSalt();
                var hashedPass = _cryptoService.Hash(registrationDto.Password, salt);
                if (await _userStorage.Create(username, new User
                {
                    Username = username,
                    PasswordHash = hashedPass,
                    Name = registrationDto.Name
                }))
                {
                    var refreshTokenValue = _cryptoService.GenerateRefreshToken();
                    var refreshTokenData = new RefreshTokenData
                    {
                        Expiry = _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.RefreshTokenExpirationSeconds),
                        IsValid = true,
                        Username = username
                    };

                    if (await _refreshTokenStorage.Create(refreshTokenValue, refreshTokenData))
                    {
                        return (true, true, new AuthenticationTokenData
                        {
                            RefreshToken = refreshTokenValue,
                            AccessToken = _jwtService.CreateAccessToken(username,
                                _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.AccessTokenExpirationSeconds))
                        });
                    }
                    else
                    {
                        await _userStorage.Delete(username);
                        throw new Exception("Collision encountered when generating refresh token");
                    }
                }

                return (false, false, null);
            }

            return (false, true, null);
        }

        public async Task<bool> TryRevokeUserAsync(AuthenticationTokenData tokenData)
        {
            var username = _jwtService.GetUsernameFromAccessToken(tokenData.AccessToken).ToLower();
            var (success, entity) = await _refreshTokenStorage.Get(tokenData.RefreshToken);
            if (success)
            {
                if (!await _refreshTokenStorage.Delete(tokenData.RefreshToken))
                    if (!await _refreshTokenStorage.Update(tokenData.RefreshToken, new RefreshTokenData
                    {
                        Expiry = entity.Expiry,
                        Username = username,
                        IsValid = false
                    }))
                        throw new Exception("Unable to invalidate old refresh token");
            }
            return true;
        }
    }
}
