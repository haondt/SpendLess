using SpendLess.Abstractions;
using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Services
{
    public class UserDataService : IUserDataService
    {
        private readonly IPrincipalService _principalService;
        private ThrowsExceptionStorage<string, User> _userStorage;

        public UserDataService(IStorage<string, User> userStorage, IPrincipalService principalService)
        {
            _userStorage = new ThrowsExceptionStorage<string, User>(userStorage);
            _principalService = principalService;
        }
        public async Task<UserInfoDto> GetUserInfo()
        {
            var user = await _userStorage.GetAsync(_principalService.GetUsername());

            return new UserInfoDto
            {
                Username = user.Username,
                Name = user.Name,
                Id = user.Id
            };
        }
    }
}
