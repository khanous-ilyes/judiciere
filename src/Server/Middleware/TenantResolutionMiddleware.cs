using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BaseLibrary.Helpers;
using Microsoft.AspNetCore.Http;
using ServerLibrary.Services;

namespace Server.Middleware
{
    public class TenantResolutionMiddleware
    {
        private readonly RequestDelegate _next;

        public TenantResolutionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var tenantClaim = context.User.FindFirst(Constants.ClaimTypes.TenantId)?.Value;
                if (!string.IsNullOrEmpty(tenantClaim) && Guid.TryParse(tenantClaim, out Guid tenantId))
                {
                    tenantService.SetCurrentTenantId(tenantId);
                }
            }

            await _next(context);
        }
    }
}
