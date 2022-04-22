using SpendLess.Configuration;
using SpendLess.Core.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions.Providers
{
    public interface ITransactionDatapointMappingProvider
    {
        Task<IEnumerable<TransactionDatapointMapping>> GetMappingsAsync(Guid accountId);
        Task<IEnumerable<TransactionDatapointMapping>> UpsertMappingsAsync(Guid accountId, IEnumerable<TransactionDatapointMappingDto> mappings);
    }
}
