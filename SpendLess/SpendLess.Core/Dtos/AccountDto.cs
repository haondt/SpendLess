using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class AccountDto : TraceableDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public ImportSettings ImportSettings { get; set; } = new ImportSettings();

    }
}
