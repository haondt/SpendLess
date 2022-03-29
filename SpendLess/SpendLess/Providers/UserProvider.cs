using SpendLess.Abstractions.Providers;
using SpendLess.Authentication.Abstractions;
using SpendLess.Domain.Models;
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
        private readonly ThrowsExceptionStorage<string, User> _userStorage;

        public UserProvider(IStorage<string, User> userStorage, IPrincipalService principalService)
        {
            _principalService = principalService;
            _userStorage = new ThrowsExceptionStorage<string, User>(userStorage);
        }
        public Task<User> GetAsync() => _userStorage.GetAsync(_principalService.GetUsername());

        public async Task<User> WriteAsync(User item)
        {
            await _userStorage.UpdateAsync(_principalService.GetUsername(), item);
            return item;
        }
    }
}
