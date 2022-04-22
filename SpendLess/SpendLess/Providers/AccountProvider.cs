using SpendLess.Abstractions.Providers;
using SpendLess.Authentication.Abstractions;
using SpendLess.Configuration;
using SpendLess.Core.Dtos;
using SpendLess.Core.Models;
using SpendLess.Domain.Enums;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Providers
{
    public class AccountsProvider : IAccountsProvider
    {
        private readonly IStorage<Guid, Account> _accountStorage;
        private readonly IStorage<string, TransactionDatapointMapping> _mappingStorage;
        private readonly IPrincipalService _principalService;

        public AccountsProvider(IStorage<Guid, Account> accountStorage, IStorage<string, TransactionDatapointMapping> mappingStorage, IPrincipalService principalService)
        {
            _accountStorage = accountStorage;
            _mappingStorage = mappingStorage;
            _principalService = principalService;
        }

        public async Task<IEnumerable<(Guid key, Account value)>> GetAsync()
        {
            return (await _accountStorage.GetManyAsync(new List<QueryParameter>
            {
                new QueryParameter(new string[]{"User"}, Operator.EqualTo, _principalService.GetUsername())
            })).Select(kvp => (kvp.Key, kvp.Value));
        }

        public async Task<IEnumerable<(Guid traceId, Guid key, Account value)>> UpsertAsync(IEnumerable<AccountUpsertRequestDto> items)
        {
            var username = _principalService.GetUsername();
            var deletedAccounts = await _accountStorage.GetManyAsync(new List<QueryParameter>
            {
                new QueryParameter(new string[]{"User"}, Operator.EqualTo, username)
            });

            var newAccounts = new List<(Guid traceId, Account account)>();
            var changedAccounts = new List<(Guid traceId, Guid key, Account value)>();

            foreach(var dto in items)
            {
                var newAccount = new Account
                {
                    User = username,
                    Balance = dto.Balance,
                    ImportSettings = dto.ImportSettings,
                    Name = dto.Name
                };

                if (string.IsNullOrEmpty(dto.Id) || !Guid.TryParse(dto.Id, out var dtoId) || dtoId == Guid.Empty)
                {
                    newAccounts.Add((dto.TraceId, newAccount));
                }
                else if (deletedAccounts.ContainsKey(dtoId))
                {
                    changedAccounts.Add((dto.TraceId, dtoId, newAccount));
                    deletedAccounts.Remove(dtoId);
                }
                else
                {
                    newAccounts.Add((dto.TraceId, newAccount));
                }
            }

            await _accountStorage.DeleteManyAsync(deletedAccounts.Select(kvp => kvp.Key));
            await Task.WhenAll(deletedAccounts.Select(async kvp => await _mappingStorage.DeleteManyAsync(new QueryParameter[]
            {
                new QueryParameter(new string[] {"AccountId"}, Operator.EqualTo, kvp.Key)
            })));
            var changeSuccesses = await _accountStorage.UpdateManyAsync(changedAccounts.ToDictionary(t => t.key, t => t.value));
            var newAccountIds = await _accountStorage.CreateManyAsync(newAccounts.Select(t => t.account));

            return changedAccounts.Zip(changeSuccesses, (a, s) => (a, s))
                .Where(t => t.s)
                .Select(t => t.a)
                .Concat(newAccounts.Zip(newAccountIds, (a, id) => (a.traceId, id, a.account)));
        }

    }
}
