using Microsoft.Extensions.DependencyInjection;
using SpendLess.Configuration;
using SpendLess.Core.Abstractions;
using SpendLess.Core.Models;
using SpendLess.Core.Services;
using SpendLess.Storage.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpendLess.Core.Extensions
{
    public static class ServiceCollectionExtensions
    {

        public static IServiceCollection AddSpendLessDomainServices(this IServiceCollection services)
        {
            services.AddTransient<IClock, Clock>();
            services.AddSpendLessPersistentStorage();
            return services;
        }

        public static IServiceCollection AddSpendLessPersistentStorage(this IServiceCollection services)
        {
            services.AddPersistentStorageWithStringKey<User>();
            services.AddPersistentStorageWithGuidKey<Account>();
            services.AddPersistentStorageWithStringKey<TransactionDatapointMapping>();
            return services;
        }
    }
}
