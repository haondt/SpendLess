using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Models
{
    public abstract class Goal
    {
        public string Name { get; set; }
        public decimal Value { get; set; }
    }
}
