using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class CategoryDto
    {
        public string Name { get; set; }
        public List<CategoryDto> Children { get; set; } = new List<CategoryDto>();
    }
}
