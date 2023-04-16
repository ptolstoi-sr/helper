# ASP.NET Core
## HealtChecks
### Nuget-Pakete
AspNetCore.HealthChecks.ApplicationStatus  
AspNetCore.HealthChecks.MySql  
AspNetCore.HealthChecks.Sqlite  
AspNetCore.HealthChecks.UI  
AspNetCore.HealthChecks.UI.Client  
AspNetCore.HealthChecks.UI.InMemory.Storage  
### Program.cs
```
using HealthChecks.ApplicationStatus.DependencyInjection;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
...
var dllname = typeof(Program).Assembly.GetName().Name ?? "Applikation";

builder.Services
    .AddHealthChecksUI(options =>
    {
        options.SetEvaluationTimeInSeconds(15); //time in seconds between check
        options.MaximumHistoryEntriesPerEndpoint(60); //maximum history of checks
        options.SetApiMaxActiveRequests(1); //api requests concurrency

        options.AddHealthCheckEndpoint(dllname,"/healthchecks"); //map health check api
    })
    .AddInMemoryStorage();

builder.Services
    .AddHealthChecks()
    .AddApplicationStatus("Applikationsstatus")
    .AddSqlite(connstring, name: "Datenbank");

builder.Services.AddControllersWithViews();

...
app.UseRouting()
    .UseEndpoints(config =>
    {
        config.MapHealthChecks("/healthchecks", new HealthCheckOptions
        {
            Predicate = _ => true,
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });
        config.MapHealthChecksUI(options =>
        {
            options.AsideMenuOpened = false;
        });
    });
...
app.UseAuthentication();
app.UseAuthorization();
...
```
### HealtChecks Call
- UI: /healthchecks-ui
- Checks: /healthchecks
