using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Configuration
{
    public struct TransactionDatapointMappingValueSource<T>
    {
        public bool IsHardCoded { get; set; }
        public bool IsRegexed { get; set; }
        public T HardCodedValue { get; set; }
        public string RegexValue { get; set; }
    }
}
