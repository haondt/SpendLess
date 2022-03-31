using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Dtos
{
    public class AccountUpsertRequestDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public string Name { get; set; }
        public decimal Balance {get;set;}
        public ImportSettings ImportSettings { get; set; }
        public List<Guid> transactionDatapointMappings { get; set; } = new List<Guid>();
    }
}
