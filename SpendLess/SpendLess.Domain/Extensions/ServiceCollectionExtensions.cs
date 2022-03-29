using Microsoft.Extensions.DependencyInjection;
using SpendLess.Domain.Abstractions;
using SpendLess.Domain.Models;
using SpendLess.Domain.Services;
using SpendLess.Storage.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Domain.Extensions
{
    public static class ServiceCollectionExtensions
    {

        public static IServiceCollection AddSpendLessDomainServices(this IServiceCollection services)
        {
            services.AddTransient<IClock, Clock>();
            services.AddPersistentStorageWithStringKey<User>();
            return services;
        }
    }
}
