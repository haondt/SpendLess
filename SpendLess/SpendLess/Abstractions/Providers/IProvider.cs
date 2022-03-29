using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions.Providers
{
    public interface IProvider<TRequest, TUpsert>
    {
        Task<TRequest> GetAsync();
        Task<TRequest> WriteAsync(TUpsert item);
    }
}
