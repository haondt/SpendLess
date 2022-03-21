using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpendLess.Domain.Models
{
    public class Account
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public decimal Value { get; set; }
        public ImportMapping ImportMapping { get; set; }
        public List<Guid> TransactionDatapointMappings { get; set; }
    }
}
