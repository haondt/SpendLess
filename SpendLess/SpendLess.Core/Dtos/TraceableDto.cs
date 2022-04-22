using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Dtos
{
    public class TraceableDto
    {
        public Guid TraceId { get; set; } = Guid.NewGuid();
    }
}
