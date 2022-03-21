using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Models
{
    public class Bank
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public List<Account> Accounts { get; set; }
    }
}
