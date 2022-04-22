using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Enums
{
    public enum Operator
    {
        LessThan = 0,
        LessThanOrEqualTo = 1,
        GreaterThan = 2,
        GreaterThanOrEqualTo = 3,
        EqualTo = 4,
        NotEqualTo = 5,
    }
}
