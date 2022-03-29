using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpendLess.Domain.Models
{
    public class Account
    {
        public Guid Id { get; set; } =  Guid.NewGuid(); // TODO: Make sure account belongs to user when adding/modifying, and delete unhooked accounts
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public ImportMapping ImportMapping { get; set; }
        public List<Guid> TransactionDatapointMappings { get; set; } = new List<Guid>(); // TODO: make sure dpms belong to user when adding/modifying, and delete unhooked dpms
    }
}
