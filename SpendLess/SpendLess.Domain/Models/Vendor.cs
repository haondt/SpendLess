using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Models
{
    public class Vendor
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string DefaultCategory { get; set; }
        public string DefaultIsRecurring { get; set; }
        public string DefaultDescription { get; set; }
    }
}
