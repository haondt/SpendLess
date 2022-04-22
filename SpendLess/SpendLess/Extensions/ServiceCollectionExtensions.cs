using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SpendLess.Abstractions.Providers;
using SpendLess.Core.Models;
using SpendLess.Providers;
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
        public static IServiceCollection AddSpendLessServices(this IServiceCollection services)
        {
            services.AddTransient<IUserProvider, UserProvider>();
            services.AddTransient<IAccountsProvider, AccountsProvider>();
            services.AddTransient<ITransactionDatapointMappingProvider, TransactionDatapointMappingProvider>();
            return services;
        }
    }
}
