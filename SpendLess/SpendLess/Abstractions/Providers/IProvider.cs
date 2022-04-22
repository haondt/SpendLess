using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions.Providers
{
    public interface IProvider<TResult, TUpsert, TUpsertResult>
    {
        Task<TResult> GetAsync();
        Task<TUpsertResult> UpsertAsync(TUpsert item);
    }
}
