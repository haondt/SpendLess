using SpendLess.Core.Dtos;
using SpendLess.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions.Providers
{
    public interface IAccountsProvider : IProvider<IEnumerable<(Guid key, Account value)>, IEnumerable<AccountUpsertRequestDto>, IEnumerable<(Guid traceId, Guid key, Account value)>>
    {
    }
}
