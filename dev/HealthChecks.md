# ASP.NET Core HealthChecks

Umfassende Dokumentation zu Health Checks in .NET 6, .NET 8, .NET 9 und .NET 10.

## 📋 Inhaltsverzeichnis
- [Überblick](#überblick)
- [Installation](#installation)
- [Grundlegende Konfiguration (.NET 8/9/10)](#grundlegende-konfiguration-net-8910)
- [Erweiterte Health Checks](#erweiterte-health-checks)
- [Health Check UI](#health-check-ui)
- [Kubernetes Integration](#kubernetes-integration)
- [Best Practices](#best-practices)
- [.NET 10 Neuheiten](#net-10-neuheiten)
- [Beispiel im Repository](#beispiel-im-repository)

---

## Überblick

Health Checks ermöglichen die Überwachung der Anwendungsgesundheit und Abhängigkeiten wie Datenbanken, Cache-Server und externe Dienste. Sie sind essenziell für:
- **Liveness Probes**: Ist die Anwendung lauffähig?
- **Readiness Probes**: Ist die Anwendung bereit, Traffic zu empfangen?
- **Startup Probes**: Hat die Anwendung erfolgreich gestartet?

---

## Installation

### NuGet-Pakete

```bash
# Basis-Paket (in .NET 8+ bereits im Framework enthalten)
dotnet add package Microsoft.Extensions.Diagnostics.HealthChecks

# Für Entity Framework Core
dotnet add package AspNetCore.HealthChecks.EntityFrameworkCore

# Für SQL Server
dotnet add package AspNetCore.HealthChecks.SqlServer

# Für PostgreSQL
dotnet add package AspNetCore.HealthChecks.NpgSql

# Für Redis
dotnet add package AspNetCore.HealthChecks.Redis

# Für MySQL
dotnet add package AspNetCore.HealthChecks.MySql

# Für SQLite
dotnet add package AspNetCore.HealthChecks.Sqlite

# Health Checks UI (Dashboard)
dotnet add package AspNetCore.HealthChecks.UI
dotnet add package AspNetCore.HealthChecks.UI.Client
dotnet add package AspNetCore.HealthChecks.UI.InMemory.Storage
```

---

## Grundlegende Konfiguration (.NET 8/9/10)

### Minimal API Syntax (Empfohlen ab .NET 6+)

```csharp
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Health Checks registrieren
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
        name: "SQL Server",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "db", "sql", "production" })
    .AddRedis(
        redisConnectionString: builder.Configuration.GetConnectionString("Redis"),
        name: "Redis Cache",
        failureStatus: HealthStatus.Degraded,
        tags: new[] { "cache", "redis" });

var app = builder.Build();

// Health Check Endpoints konfigurieren
app.MapHealthChecks("/health", new HealthCheckOptions
{
    Predicate = _ => true,
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var response = new
        {
            status = report.Status.ToString(),
            totalDuration = report.TotalDuration.TotalSeconds.ToString("F2"),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                duration = e.Value.Duration.TotalMilliseconds.ToString("F2"),
                description = e.Value.Description
            })
        };
        await context.Response.WriteAsJsonAsync(response);
    }
});

// Nur für Liveness (ohne Abhängigkeiten)
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false // Keine externen Checks
});

// Nur für Readiness (mit Abhängigkeiten)
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("production")
});

app.Run();
```

---

## Erweiterte Health Checks

### Datenbank-Checks

#### SQL Server mit Timeout
```csharp
builder.Services.AddHealthChecks()
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
        name: "SQL Server",
        commandTimeout: TimeSpan.FromSeconds(5),
        tags: new[] { "db", "sql" });
```

#### PostgreSQL
```csharp
builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("PostgresConnection"),
        name: "PostgreSQL",
        configure: options => options.CommandTimeout = 5,
        tags: new[] { "db", "postgres" });
```

#### Entity Framework Core
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>(
        name: "Application DB",
        tags: new[] { "db", "efcore" });
```

### Redis Check
```csharp
builder.Services.AddHealthChecks()
    .AddRedis(
        redisConnectionString: builder.Configuration.GetConnectionString("Redis"),
        name: "Redis",
        timeout: TimeSpan.FromSeconds(3),
        tags: new[] { "cache" });
```

### URI / HTTP Endpoint Check
```csharp
builder.Services.AddHealthChecks()
    .AddUrlGroup(
        uri: new Uri("https://api.external-service.com/health"),
        name: "External API",
        method: HttpMethod.Get,
        tags: new[] { "external", "api" });
```

### System-Ressourcen Checks

#### Memory Check
```csharp
builder.Services.AddHealthChecks()
    .AddCheck<MemoryHealthCheck>(
        name: "Memory",
        failureStatus: HealthStatus.Degraded,
        tags: new[] { "system" });

public class MemoryHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var memoryLimit = 1024 * 1024 * 1024; // 1 GB
        var currentMemory = GC.GetTotalMemory(false);
        
        if (currentMemory > memoryLimit)
        {
            return Task.FromResult(HealthCheckResult.Degraded(
                $"Speicherverbrauch: {currentMemory / 1024 / 1024} MB"));
        }
        
        return Task.FromResult(HealthCheckResult.Healthy(
            $"Speicherverbrauch: {currentMemory / 1024 / 1024} MB"));
    }
}
```

#### Disk Space Check
```csharp
builder.Services.AddHealthChecks()
    .AddDiskStorageHealthCheck(options =>
    {
        options.AddDrive("C:\\", 1024); // Mindestens 1 GB frei
        options.AddDrive("D:\\", 2048); // Mindestens 2 GB frei
    }, name: "Disk Space");
```

#### Process Check
```csharp
builder.Services.AddHealthChecks()
    .AddProcessAllocatedMemoryHealthCheck(
        maximumMemoryBytes: 500 * 1024 * 1024, // 500 MB
        name: "Process Memory");
```

---

## Health Check UI

### Konfiguration

```csharp
// Registrierung
builder.Services
    .AddHealthChecksUI(setup =>
    {
        setup.SetEvaluationTimeInSeconds(30); // Check-Intervall
        setup.MaximumHistoryEntriesPerEndpoint(100); // Verlauf
        setup.SetApiMaxActiveRequests(5); // Parallelität
        setup.AddHealthCheckEndpoint("API Health", "/health");
    })
    .AddInMemoryStorage(); // Oder: AddSqliteStorage(), AddSqlServerStorage()

// Middleware
app.UseHealthChecksUI(options =>
{
    options.UIPath = "/healthchecks-ui";
    options.ApiPath = "/healthchecks-api";
    options.AsideMenuOpened = true;
    options.AddCustomStylesheet("wwwroot/css/healthcheck-custom.css");
});
```

### Zugriff
- **UI Dashboard**: `/healthchecks-ui`
- **API Endpoint**: `/healthchecks-api`
- **Raw Health**: `/health`

---

## Kubernetes Integration

### Deployment Beispiel

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
      - name: my-app
        image: my-app:latest
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 20
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
          timeoutSeconds: 3
          successThreshold: 2
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 0
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 30
```

---

## Best Practices

### 1. Trennung der Check-Typen
- **Liveness**: Nur essentielle Checks (App ist lauffähig)
- **Readiness**: Alle produktionsrelevanten Abhängigkeiten
- **Startup**: Langsame Initialisierungen (z.B. Datenbank-Migrationen)

### 2. Timeouts setzen
```csharp
.AddSqlServer(connectionString, timeout: TimeSpan.FromSeconds(5))
```

### 3. Tags verwenden
```csharp
tags: new[] { "production", "critical", "db" }
```

### 4. Degraded Status nutzen
Bei nicht-kritischen Fehlern statt Unhealthy:
```csharp
failureStatus: HealthStatus.Degraded
```

### 5. Sicherheit
```csharp
// Health Checks nur intern zugänglich machen
app.MapHealthChecks("/health", options)
    .RequireAuthorization("HealthCheckPolicy")
    .RequireHost("localhost", "internal-network");
```

### 6. Performance
- Vermeide langsame Checks in Liveness Probes
- Caching bei externen API-Checks
- Angemessene Intervalle wählen

---

## .NET 10 Neuheiten

### Verbesserte Performance
- Reduzierte Allokationen in Health Check APIs
- Optimierte JSON-Serialisierung für Response Writer
- Async-freie Pfade für synchrone Checks

### Enhanced OpenTelemetry Integration
```csharp
// Automatische Metriken für Health Checks
builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics =>
    {
        metrics.AddMeter("System.Net.Http");
        metrics.AddMeter("Microsoft.AspNetCore.Diagnostics.HealthChecks");
    });
```

### Neue Built-in Checks
```csharp
// GCP Cloud Health Check (neu in .NET 10)
builder.Services.AddHealthChecks()
    .AddGoogleCloudHealthCheck(options =>
    {
        options.ProjectId = "my-project";
        options.Region = "us-central1";
    });

// Azure Service Bus (erweitert in .NET 10)
builder.Services.AddHealthChecks()
    .AddAzureServiceBusQueue(
        connectionString: "...",
        queueName: "my-queue",
        name: "Service Bus Queue");
```

### Improved Kubernetes Support
- Native Unterstützung für `startupProbe` in Templates
- Automatische Retry-Logik bei transienten Fehlern
- Bessere Integration mit Dapr Sidecar

---

## Troubleshooting

### Häufige Probleme

**Problem**: Health Check timeoutet regelmäßig  
**Lösung**: Timeout erhöhen oder Check optimieren
```csharp
.AddSqlServer(connectionString, timeout: TimeSpan.FromSeconds(10))
```

**Problem**: UI zeigt keine Historie  
**Lösung**: Storage Provider konfigurieren
```csharp
.AddSqliteStorage("Data Source=healthchecks.db")
```

**Problem**: Falscher Status bei Dependency Failure  
**Lösung**: `failureStatus` explizit setzen
```csharp
failureStatus: HealthStatus.Degraded // statt Unhealthy
```

---

## Beispiel im Repository

Ein vollständiges, lauffähiges Beispiel für die Implementierung von Health Checks in diesem Repository findest du in der [`Program.cs`](./Program.cs) Datei.

Das Beispiel zeigt:
- ✅ **Liveness Probe** (`/health/live`) - Prüft nur, ob die Anwendung läuft
- ✅ **Readiness Probe** (`/health/ready`) - Prüft produktionsrelevante Abhängigkeiten mit Tags
- ✅ **Vollständige Health Checks** (`/healthchecks`) - Alle Checks mit UI Support
- ✅ **Health Checks UI Dashboard** (`/healthchecks-ui`) - Visuelles Monitoring-Dashboard
- ✅ **MySQL Datenbank-Checks** - Mit Tags für Kubernetes Probes
- ✅ **Moderne .NET 8/9/10 Syntax** - Ohne veraltete `UseEndpoints`-Methoden

### Endpoints im Beispiel

| Endpoint | Beschreibung | Verwendung |
|----------|--------------|------------|
| `/health/live` | Liveness Probe | Kubernetes Liveness Probe |
| `/health/ready` | Readiness Probe | Kubernetes Readiness Probe |
| `/healthchecks` | Vollständige Checks | Manuelles Testing, UI API |
| `/healthchecks-ui` | Dashboard | Visuelle Überwachung |

---

*Diese Dokumentation wird kontinuierlich aktualisiert. Letzte Revision: .NET 10 (2025)*
