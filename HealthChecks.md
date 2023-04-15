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
builder.Services
    .AddHealthChecks()
    .AddApplicationStatus("Applikationsstatus")
    .AddMySql(connectionString, "Datenbank MasterDB")
    .AddSqlite(connectionStringSettings, name: "Datenbank Settings")
;

builder.Services
    .AddHealthChecksUI()
    .AddInMemoryStorage();

...
app.UseHealthChecksUI(config =>
{
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
    });
...
app.UseAuthentication();
app.UseAuthorization();
...
```
### appsettings.json
```
...
  "HealthChecksUI": {
    "HealthChecks": [
      {
        "Name": "AppHealth",
        "Uri": "/healthcheck"
      }
    ],
    "EvaluationTimeInSeconds": 30
  },
  "Logging": {
...
```
### HealtChecks Call
- UI: /healthcheck-ui
- Checks: /healthcheck
