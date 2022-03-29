using SpendLess.Domain.Dtos;
using SpendLess.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions.Providers
{
    public interface IAccountsProvider : IProvider<IEnumerable<Account>, IEnumerable<AccountUpsertRequestDto>>
    {
    }
}
