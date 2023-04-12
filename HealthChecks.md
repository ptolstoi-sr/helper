# ASP.NET Core
## HealtChecks
### Nuget-Pakete
AspNetCore.HealthChecks.ApplicationStatus  
AspNetCore.HealthChecks.MySql  
AspNetCore.HealthChecks.UI  
AspNetCore.HealthChecks.UI.Client  
AspNetCore.HealthChecks.UI.InMemory.Storage  
### Program.cs
```
using HealthChecks.ApplicationStatus.DependencyInjection;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
...
builder.Services
    .AddHealthChecks()
    .AddApplicationStatus("Applikationsstatus")
    .AddMySql(connectionString, "Datenbank IMS.Portal")
    .AddMySql(connectionStringQm, "Datenbank IMS.Qm")
;

builder.Services
    .AddHealthChecksUI()
    .AddInMemoryStorage();

...
app.UseHealthChecksUI(config =>
{
    config.ResourcesPath = "/ui/resources";
    config.UIPath = "/healthcheck-ui";
});

app.UseRouting()
    .UseEndpoints(config =>
    {
        config.MapHealthChecks("/healthcheck", new HealthCheckOptions
        {
            Predicate = _ => true,
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });
        //config.MapHealthChecksUI();
    });

...
```
