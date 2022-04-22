using SpendLess.Abstractions.Providers;
using SpendLess.Authentication.Abstractions;
using SpendLess.Configuration;
using SpendLess.Core.Dtos;
using SpendLess.Core.Enums;
using SpendLess.Core.Models;
using SpendLess.Domain.Enums;
using SpendLess.Domain.Extensions;
using SpendLess.Storage;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SpendLess.Providers
{
    public class TransactionDatapointMappingProvider : ITransactionDatapointMappingProvider
    {
        private readonly IAccountsProvider _accountsProvider;
        private readonly IStorage<string, TransactionDatapointMapping> _mappingStorage;
        private readonly IUserProvider _userProvider;

        public TransactionDatapointMappingProvider(
            IAccountsProvider accountsProvider,
            IStorage<string, TransactionDatapointMapping> mappingStorage,
            IUserProvider userProvider)
        {
            _accountsProvider = accountsProvider;
            _mappingStorage = mappingStorage;
            _userProvider = userProvider;
        }


        public async Task<IEnumerable<TransactionDatapointMapping>> GetMappingsAsync(Guid accountId)
        {
            var accounts = await _accountsProvider.GetAsync();
            foreach(var account in accounts)
            {
                if (account.key == accountId)
                {
                    var mappings = await _mappingStorage.GetManyAsync(new QueryParameter[]
                    {
                        new QueryParameter(new string[]{"AccountId"}, Operator.EqualTo, accountId)
                    });
                    return mappings.Select(m => m.Value);
                }
            }
            throw new KeyNotFoundException("Unable to locate an account with the given id belonging to the current user");
        }

        public async Task<IEnumerable<TransactionDatapointMapping>> UpsertMappingsAsync(Guid accountId, IEnumerable<TransactionDatapointMappingDto> mappings)
        {
            var accounts = await _accountsProvider.GetAsync();
            foreach(var account in accounts)
            {
                if (account.key == accountId)
                {
                    var deletedMappings = await _mappingStorage.GetManyAsync(new QueryParameter[]
                    {
                        new QueryParameter(new string[]{"AccountId"}, Operator.EqualTo, accountId)
                    });
                    var newMappings = mappings.Select(m => ReverseMap(accountId, m))
                        .Select(Sanitize);

                    var vendorMappings = newMappings
                        .Where(m => m.ParserOperation == TransactionDatapointMappingOperation.Is)
                        .Where(m => m.ParserDatapoint == TransactionDatapoints.Vendor);
                    var categoryMappings = newMappings
                        .Where(m => m.ParserOperation == TransactionDatapointMappingOperation.Is)
                        .Where(m => m.ParserDatapoint == TransactionDatapoints.Category);

                    var user = await _userProvider.GetAsync();
                    var oldVendors = user.Vendors.Select(v => v.Name).ToHashSet();
                    var oldCategories = user.Categories.Select(c => c.Name).ToHashSet();
                    var newVendors = vendorMappings.Select(m => m.ParserStringValue)
                        .Select(v => v.FormatForDisplay())
                        .Distinct(StringComparer.InvariantCultureIgnoreCase)
                        .Where(m => !oldVendors.Contains(m, StringComparer.InvariantCultureIgnoreCase));
                    var newCategories = categoryMappings.Select(m => m.ParserStringValue)
                        .Select(v => v.FormatForDisplay())
                        .Distinct(StringComparer.InvariantCultureIgnoreCase)
                        .Where(m => !oldCategories.Contains(m, StringComparer.InvariantCultureIgnoreCase));
                    user.Vendors.AddRange(newVendors.Select(v => new Vendor { Name = v }));
                    user.Categories.AddRange(newCategories.Select(c => new Category { Name = c }));

                    await _userProvider.UpsertAsync(user);
                    await _mappingStorage.CreateManyAsync(newMappings);
                    await _mappingStorage.DeleteManyAsync(deletedMappings.Select(m => m.Key));
                    return newMappings;
                }
            }
            throw new KeyNotFoundException("Unable to locate an account with the given id belonging to the current user");
        }

        private TransactionDatapointMapping ReverseMap(Guid accountId, TransactionDatapointMappingDto dto)
        {
            return new TransactionDatapointMapping
            {
                AccountId = accountId,
                IsDefault = dto.IsDefault,
                DetectorColumn = dto.DetectorColumn,
                DetectorOperation = (TransactionDatapointMappingOperation)dto.DetectorOperation,
                DetectorComparison = (Operator)dto.DetectorComparison,
                DetectorStringValue = dto.DetectorStringValue,
                DetectorValueIsNumeric = dto.DetectorValueIsNumeric,
                ParserDatapoint = (TransactionDatapoints)dto.ParserDatapoint,
                ParserOperation = (TransactionDatapointMappingOperation)dto.ParserOperation,
                ParserNumericValue = dto.ParserNumericValue,
                ParserStringValue = dto.ParserStringValue,
                ParserColumn = dto.ParserColumn,
                ParserInvertValue = dto.ParserInvertValue,
                ParserDateTimeValue = dto.ParserDateTimeValue,
                ParserBoolValue = dto.ParserBoolValue
            };
        }

        private TransactionDatapointMapping Sanitize(TransactionDatapointMapping mapping)
        {
            if (mapping.ParserOperation == TransactionDatapointMappingOperation.Is)
            {
                if (mapping.ParserDatapoint == TransactionDatapoints.Category 
                    || mapping.ParserDatapoint == TransactionDatapoints.Vendor)
                {
                    mapping.ParserStringValue = mapping.ParserStringValue.FormatForDisplay();
                }
            }
            return mapping;
        }
    }
}
