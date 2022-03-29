using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using SpendLess.Authentication.Abstractions;
using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using SpendLess.Authentication.Settings;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpendLess.Domain.Abstractions;

namespace SpendLess.Authentication.Services
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
            var username = authenticationDto.Username;
            if (!string.IsNullOrEmpty(username))
            {
                var (success, entity) = await _userStorage.GetAsync(username);
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
                        
                        if (await _refreshTokenStorage.CreateAsync(refreshTokenValue, refreshTokenData))
                        {
                            return (true, new AuthenticationTokenData
                            {
                                RefreshToken = refreshTokenValue,
                                SessionToken = _jwtService.CreateAccessToken(username, 
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


        public async Task<(bool success, AuthenticationTokenData newTokenData)> TryRefreshSessionTokenAsync(string refreshToken)
        {
            var (success, entity) = await _refreshTokenStorage.GetAsync(refreshToken);
            if (success && entity.IsValid && entity.Expiry > _clock.UtcNow)
            {
                var newRefreshToken = _cryptoService.GenerateRefreshToken();
                var newRefreshTokenData = new RefreshTokenData
                {
                    Expiry = entity.Expiry,
                    Username = entity.Username,
                    IsValid = true
                };

                if (!await _refreshTokenStorage.CreateAsync(newRefreshToken, newRefreshTokenData))
                {
                    if (!await _refreshTokenStorage.DeleteAsync(refreshToken))
                        if (!await _refreshTokenStorage.UpdateAsync(refreshToken, new RefreshTokenData
                        {

                            Expiry = entity.Expiry,
                            IsValid = false,
                            Username = entity.Username
                        }))
                        {
                            if (!await _refreshTokenStorage.DeleteAsync(newRefreshToken))
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
                        SessionToken = _jwtService.CreateAccessToken(entity.Username,
                            _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.AccessTokenExpirationSeconds))
                    });
                }
            }
            return (false, null);
        }

        public async Task<(bool success, bool usernameAvailable, AuthenticationTokenData tokenData)> TryRegisterUserAsync(UserRegistrationDto registrationDto)
        {
            var username = registrationDto.Username;
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(registrationDto.Password))
            {
                var salt = _cryptoService.GenerateSalt();
                var hashedPass = _cryptoService.Hash(registrationDto.Password, salt);
                if (await _userStorage.CreateAsync(username, new User
                {
                    PasswordHash = hashedPass,
                    PasswordSalt = salt,
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

                    if (await _refreshTokenStorage.CreateAsync(refreshTokenValue, refreshTokenData))
                    {
                        return (true, true, new AuthenticationTokenData
                        {
                            RefreshToken = refreshTokenValue,
                            SessionToken = _jwtService.CreateAccessToken(username,
                                _clock.UtcNow + TimeSpan.FromSeconds(_authenticationSettings.AccessTokenExpirationSeconds))
                        });
                    }
                    else
                    {
                        await _userStorage.DeleteAsync(username);
                        throw new Exception("Collision encountered when generating refresh token");
                    }
                }

                return (false, false, null);
            }

            return (false, true, null);
        }

        public async Task<bool> TryRevokeUserAsync(string refreshToken)
        {
            var (success, entity) = await _refreshTokenStorage.GetAsync(refreshToken);
            if (success)
            {
                if (!await _refreshTokenStorage.DeleteAsync(refreshToken))
                    if (!await _refreshTokenStorage.UpdateAsync(refreshToken, new RefreshTokenData
                    {
                        Expiry = entity.Expiry,
                        Username = entity.Username,
                        IsValid = false
                    }))
                        throw new Exception("Unable to invalidate old refresh token");
            }
            return true;
        }
    }
}
