using Microsoft.AspNetCore.Mvc;
using SpendLess.Abstractions.Providers;
using SpendLess.Configuration;
using SpendLess.Core.Dtos;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpendLess.API.Controllers
{
    public class TransactionDatapointMappingController : BaseController
    {
        private readonly ITransactionDatapointMappingProvider _provider;

        public TransactionDatapointMappingController(ITransactionDatapointMappingProvider provider)
        {
            _provider = provider;
        }

        [HttpGet]
        [Route("accounts/{accountId}/mappings")]
        public async Task<IActionResult> Get(string accountId)
        {
            if (Guid.TryParse(accountId, out Guid id))
            {
                var mappings = await _provider.GetMappingsAsync(id);
                return new OkObjectResult(mappings.Select(m => Map(id, m)));
            }
            return new BadRequestResult();
        }

        [HttpPost]
        [Route("accounts/{accountId}/mappings")]
        public async Task<IActionResult> Upsert(string accountId, [FromBody] IEnumerable<TransactionDatapointMappingDto> mappingDtos)
        {
            if (Guid.TryParse(accountId, out Guid id))
            {
                var mappings = await _provider.UpsertMappingsAsync(id, mappingDtos);
                return new OkObjectResult(mappings.Select(m => Map(id, m)));
            }
            return new BadRequestResult();
        }

        private TransactionDatapointMappingDto Map(Guid accountId, TransactionDatapointMapping mapping)
        {
            return new TransactionDatapointMappingDto
            {
                IsDefault = mapping.IsDefault,
                DetectorColumn = mapping.DetectorColumn,
                DetectorOperation = (int)mapping.DetectorOperation,
                DetectorComparison = (int)mapping.DetectorComparison,
                DetectorStringValue = mapping.DetectorStringValue,
                DetectorValueIsNumeric = mapping.DetectorValueIsNumeric,
                ParserDatapoint = (int)mapping.ParserDatapoint,
                ParserOperation = (int)mapping.ParserOperation,
                ParserNumericValue = mapping.ParserNumericValue,
                ParserStringValue = mapping.ParserStringValue,
                ParserColumn = mapping.ParserColumn,
                ParserInvertValue = mapping.ParserInvertValue,
                ParserDateTimeValue = mapping.ParserDateTimeValue,
                ParserBoolValue = mapping.ParserBoolValue
            };
        }
    }
}
