using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Configuration
{
    public class TransactionDatapointMapping
    {
        public Guid Id { get; set; }

        // Datapoint detection
        public string DetectionRegex { get; set; }
        public string ContainsTerm { get; set; }

        // Datpoint parsing
        public bool SetsRecurring { get; set; }
        public TransactionDatapointMappingValueSource<bool> Recurring { get; set; }

        public bool SetsCategory { get; set; }
        public TransactionDatapointMappingValueSource<string> Category { get; set; }

        public bool SetsVendor { get; set; }
        public TransactionDatapointMappingValueSource<Guid> Vendor { get; set; }

        public bool SetsDescription { get; set; }
        public TransactionDatapointMappingValueSource<string> Description { get; set; }
    }
}
