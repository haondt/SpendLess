using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SpendLess.Domain.Enums;
using SpendLess.Domain.Extensions;

namespace SpendLess.Storage
{
    public struct QueryParameter
    {
        /// <summary>
        /// Left hand (incoming) value
        /// </summary>
        public List<string> PropertyKey { get; set; }

        public Operator Operator { get; set; }
        /// <summary>
        /// Right hand (static) value
        /// </summary>
        public object Operand { get; set; }
        public QueryParameter(IEnumerable<string> propertyKey, Operator @operator, object operand)
        {
            PropertyKey = propertyKey.ToList();
            Operator = @operator;
            Operand = operand;
        }

        public bool PerformComparison(object left)
        {
            var leftType = Type.GetTypeCode(left.GetType());
            var rightType = Type.GetTypeCode(Operand.GetType());

            if (leftType.IsNumeric())
            {
                if (rightType.IsNumeric())
                {
                    return PerformNumericComparison((double)left, (double)Operand);
                }
            }
            else if (leftType == rightType)
            {
                switch (leftType)
                {
                    case TypeCode.Boolean:
                    case TypeCode.String:
                    case TypeCode.Char:
                        return PerformObjectComparison(left, Operand);
                    case TypeCode.DateTime:
                        return PerformNumericComparison(((DateTime)left).Ticks, ((DateTime)Operand).Ticks);
                    default:
                        return PerformObjectComparison(left, Operand);
                }
            }
            throw new InvalidOperationException($"Cannot compare operands of type {left.GetType()} and {Operand.GetType()} with operator {Operator}");
        }

        private bool PerformNumericComparison(double left, double right)
        {
            switch (Operator)
            {
                case Operator.LessThan:
                    return left < right;
                case Operator.LessThanOrEqualTo:
                    return left <= right;
                case Operator.GreaterThan:
                    return left > right;
                case Operator.GreaterThanOrEqualTo:
                    return left >= right;
                case Operator.EqualTo:
                    return left == right;
                case Operator.NotEqualTo:
                    return left != right;
            }
            throw new InvalidOperationException($"Cannot compare operands of type double with operator {Operator}");
        }

        private bool PerformObjectComparison(object left, object right)
        {
            if (left == null || right == null)
            {
                if (Operator == Operator.EqualTo)
                    return left == null && right == null;
                else if (Operator == Operator.NotEqualTo)
                    return !(left == null && right == null);
                return false;
            }
            switch (Operator)
            {
                case Operator.EqualTo:
                    return left.Equals(right);
                case Operator.NotEqualTo:
                    return !left.Equals(right);
            }
            throw new InvalidOperationException($"Cannot compare operands of unknown type with operator {Operator}");
        }

    }
}
