using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class AccountUpsertRequestDto : TraceableDto
    {
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        public decimal Balance {get;set;}
        public ImportSettings ImportSettings { get; set; }
    }
}
