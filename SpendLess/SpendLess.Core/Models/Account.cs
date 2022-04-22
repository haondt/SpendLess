using SpendLess.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpendLess.Core.Models
{
    public class Account
    {
        public string User { get; set; }
        public string Name { get; set; }
        public decimal Balance { get; set; }
        public ImportSettings ImportSettings { get; set; } = new ImportSettings();
    }
}
