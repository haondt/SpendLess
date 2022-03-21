using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace SpendLess.API.ExceptionFilters
{
    public class ExceptionFilter : ExceptionFilterAttribute
    {
        private readonly Type _exceptionType;
        private readonly int _code;

        public ExceptionFilter(Type exceptionType, int code)
        {
            _exceptionType = exceptionType;
            _code = code;
        }

        public override void OnException(ExceptionContext context)
        {
            if (context.Exception.GetType() == _exceptionType)
            {
                context.HttpContext.Response.StatusCode = _code;
            }
            base.OnException(context);
        }
    }
}
