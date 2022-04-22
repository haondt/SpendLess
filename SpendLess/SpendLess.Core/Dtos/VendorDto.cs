using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class VendorDto
    {
        public string Name { get; set; }
        public string DefaultCategory { get; set; }
        public bool DefaultIsRecurring { get; set; }
        public string DefaultDescription { get; set; }
    }
}
