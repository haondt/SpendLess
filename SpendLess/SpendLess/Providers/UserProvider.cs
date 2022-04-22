using SpendLess.Abstractions.Providers;
using SpendLess.Authentication.Abstractions;
using SpendLess.Core.Models;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Providers
{
    public class UserProvider : IUserProvider
    {
        private readonly IPrincipalService _principalService;
        private readonly IStorage<string, User> _userStorage;

        public UserProvider(IStorage<string, User> userStorage, IPrincipalService principalService)
        {
            _principalService = principalService;
            _userStorage = userStorage;
        }
        public async Task<User> GetAsync()
        {
            var user = await _userStorage.GetAsync(_principalService.GetUsername());
            if (user.success)
                return user.entity;
            throw new KeyNotFoundException();
        }

        public async Task<User> UpsertAsync(User item)
        {
            if (!(await _userStorage.UpdateAsync(_principalService.GetUsername(), item)))
                throw new KeyNotFoundException();
            return item;
        }
    }
}
