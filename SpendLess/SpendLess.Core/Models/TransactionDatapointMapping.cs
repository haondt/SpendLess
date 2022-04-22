using SpendLess.Core.Enums;
using SpendLess.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SpendLess.Configuration
{
    public class TransactionDatapointMapping
    {
        public Guid AccountId { get; set; }
        public bool IsDefault { get; set; }

        public int? DetectorColumn { get; set; }
        public TransactionDatapointMappingOperation DetectorOperation { get; set; }
        public Operator DetectorComparison { get; set; }
        public string DetectorStringValue { get; set; }
        public bool DetectorValueIsNumeric { get; set; }

        public TransactionDatapoints ParserDatapoint { get; set; }
        public TransactionDatapointMappingOperation ParserOperation { get; set; }
        public int ParserNumericValue { get; set; }
        public string ParserStringValue { get; set; }
        public int ParserColumn { get; set; }
        public bool ParserInvertValue { get; set; }
        public string ParserDateTimeValue { get; set; }
        public bool ParserBoolValue { get; set; }
    }
}
