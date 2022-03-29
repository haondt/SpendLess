using SpendLess.Abstractions;
using SpendLess.Abstractions.Providers;
using SpendLess.Authentication.Abstractions;
using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Providers
{
    public class UserInfoProvider : IUserInfoProvider
    {
        private readonly IUserProvider _userProvider;
        private readonly IPrincipalService _principalService;

        public UserInfoProvider(IUserProvider userProvider, IPrincipalService principalService)
        {
            _userProvider = userProvider;
            _principalService = principalService;
        }
        public async Task<UserInfoDto> GetUserInfo()
        {
            var username = _principalService.GetUsername();
            var user = await _userProvider.GetAsync();

            return new UserInfoDto
            {
                Username = username,
                Name = user.Name,
            };
        }
    }
}
