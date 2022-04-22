using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Enums
{
    public enum TransactionDatapointMappingOperation
    {
        Is = 0,
        IsNotEmpty = 1,
        IsEmpty = 2,
        matchesRegularExpression = 3,
        IsColumn = 4,
        ParseColumn = 5,
    }
}
