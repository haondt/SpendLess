using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Models
{
    public class Category
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public List<Category> Children { get; set; } = new List<Category>();
    }
}
