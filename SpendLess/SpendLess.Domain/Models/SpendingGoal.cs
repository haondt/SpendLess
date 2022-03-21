using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Models
{
    public class SpendingGoal
    {
        public string Category { get; set; }
        public Guid Vendor { get; set; }
    }
}
