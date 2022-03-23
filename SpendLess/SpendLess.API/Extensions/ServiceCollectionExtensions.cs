using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace SpendLess.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSpendLessAPIServices(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            return services;
        }
    }
}
