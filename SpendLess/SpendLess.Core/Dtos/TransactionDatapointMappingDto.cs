using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class TransactionDatapointMappingDto
    {
        public bool IsDefault { get; set; }

        public int? DetectorColumn { get; set; }
        public int DetectorOperation { get; set; }
        public int DetectorComparison { get; set; }
        public string DetectorStringValue { get; set; }
        public bool DetectorValueIsNumeric { get; set; }

        public int ParserDatapoint { get; set; }
        public int ParserOperation { get; set; }
        public int ParserNumericValue { get; set; }
        public string ParserStringValue { get; set; }
        public int ParserColumn { get; set; }
        public bool ParserInvertValue { get; set; }
        public DateTime ParserDateTimeValue { get; set; }
        public bool ParserBoolValue { get; set; }
    }
}
