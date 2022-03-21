using Microsoft.Extensions.DependencyInjection;
using SpendLess.Abstractions;
using SpendLess.Domain.Models;
using SpendLess.Services;
using SpendLess.Storage.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddAuthenticationServices(this IServiceCollection services)
        {
            return services;
        }

        public static IServiceCollection AddSpendLessServices(this IServiceCollection services)
        {
            services.AddSingleton<IClock, Clock>();
            return services;
        }

        public static IServiceCollection AddPersistentStorage(this IServiceCollection services)
        {
            services.AddPersistentStorageWithStringKey<RefreshTokenData>();
            services.AddPersistentStorageWithStringKey<User>();
            return services;
        }
    }
}
