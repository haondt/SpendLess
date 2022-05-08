using Microsoft.AspNetCore.Mvc;
using SpendLess.Core.Dtos.Transactions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpendLess.API.Controllers
{
    public class TransactionsController : BaseController
    {
        public TransactionsController()
        {

        }

        [HttpGet]
        [Route("accounts/{accountId}/transactions")]
        public async Task<IActionResult> GetTransactionsAsync(string accountId,
            [FromQuery] int page,
            [FromQuery] int pageSize)
        {
            return new OkResult();
        }

        [HttpGet]
        [Route("accounts/{accountId}/transactions/count")]
        public async Task<IActionResult> GetNumTransactionsAsync(string accountId)
        {
            return new OkResult();
        }

        [HttpDelete]
        [Route("accounts/{accountId}/transactions")]
        public async Task<IActionResult> DeleteTransactionsAsync(string accountId, IEnumerable<Guid> transactionIds)
        {
            return new OkResult();
        }

        [HttpPost]
        [Route("accounts/{accountId}/transactions")]
        public async Task<IActionResult> CreateTransactionsAsync(string accountId, IEnumerable<TransactionCreateRequestDto> transactionDtos)
        {
            return new OkResult();
        }

        [HttpPut]
        [HttpPatch]
        [Route("accounts/{accountId}/transactions")]
        public async Task<IActionResult> UpdateTransactionsAsync(string accountId, IEnumerable<TransactionDto> transactionDtos)
        {
            return new OkResult();
        }

    }
}
