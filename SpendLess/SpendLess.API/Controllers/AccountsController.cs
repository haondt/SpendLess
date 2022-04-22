using Microsoft.AspNetCore.Mvc;
using SpendLess.Abstractions.Providers;
using SpendLess.Core.Dtos;
using SpendLess.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpendLess.API.Controllers
{
    public class AccountsController : BaseController
    {
        private readonly IAccountsProvider _accountsProvider;

        public AccountsController(IAccountsProvider accountsProvider)
        {
            _accountsProvider = accountsProvider;
        }

        [HttpGet]
        [Route("accounts")]
        public async Task<IActionResult> GetAccountsAsync()
        {
            var accounts = await _accountsProvider.GetAsync();
            var accountDtos = accounts.Select(Map);
            return new OkObjectResult(accountDtos);
        }

        [HttpPost]
        [Route("accounts")]
        public async Task<IActionResult> UpsertAccountsAsync([FromBody] IEnumerable<AccountUpsertRequestDto> accounts)
        {
            return new OkObjectResult((await _accountsProvider.UpsertAsync(accounts)).Select(Map));
        }

        private AccountDto Map((Guid traceId, Guid key, Account value) a)
        {
            return new AccountDto
            {
                TraceId = a.traceId,
                Balance = a.value.Balance,
                Id = a.key.ToString(),
                ImportSettings = a.value.ImportSettings,
                Name = a.value.Name,
            };
        }

        private AccountDto Map((Guid key, Account value) a)
        {
            return new AccountDto
            {
                Balance = a.value.Balance,
                Id = a.key.ToString(),
                ImportSettings = a.value.ImportSettings,
                Name = a.value.Name,
            };

        }
    }
}
