using SpendLess.Abstractions.Providers;
using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Providers
{
    public class AccountsProvider : IAccountsProvider
    {
        private readonly IUserProvider _userProvider;

        public AccountsProvider(IUserProvider userProvider)
        {
            _userProvider = userProvider;
        }
        public async Task<IEnumerable<Account>> GetAsync()
        {
            return (await _userProvider.GetAsync()).Accounts;
        }

        public async Task<IEnumerable<Account>> WriteAsync(IEnumerable<AccountUpsertRequestDto> item)
        {
            var user = await _userProvider.GetAsync();
            user.Accounts = item.Select(dto => new Account
            {
                Id = dto.Id,
                Balance = dto.Balance,
                ImportMapping = dto.importMapping,
                TransactionDatapointMappings = dto.transactionDatapointMappings,
                Name = dto.Name
            }).ToList();
            var updatedUser = await _userProvider.WriteAsync(user);
            return updatedUser.Accounts;
        }
    }
}
