using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace SpendLess.API.ExceptionFilters
{
    public class InheritableExceptionFilter : AbstractExceptionFilter
    {
        public InheritableExceptionFilter(Type exceptionType, int code, string message = null) : base(exceptionType, code, message)
        {
        }

        protected override bool CheckExceptionType(Type exceptionType) => _exceptionType.IsAssignableFrom(exceptionType);
    }
}
