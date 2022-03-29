using Microsoft.AspNetCore.Mvc;
using SpendLess.Abstractions.Providers;
using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using System.Collections.Generic;
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
            return new OkObjectResult(accounts);
        }

        [HttpPost]
        [Route("accounts")]
        public async Task<IActionResult> UpsertAccountsAsync([FromBody] IEnumerable<AccountUpsertRequestDto> accounts)
        {
            return new OkObjectResult(await _accountsProvider.WriteAsync(accounts));
        }
    }
}
