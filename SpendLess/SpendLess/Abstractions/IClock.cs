using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Abstractions
{
    public interface IClock
    {
        public DateTime UtcNow { get; }
    }
}
