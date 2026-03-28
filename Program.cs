using HealthChecks.UI.Client;
using Speicher;
using Speicher.Modulle1;
using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Runtime.InteropServices;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Verbindungszeile 'DefaultConnection' nicht definiert.");
string connectionStringModulle1 = builder.Configuration.GetConnectionString("Modulle1Connection") ?? throw new InvalidOperationException("Verbindungszeile 'Modulle1Connection' nicht definiert.");

InitialisierungDatenbanken(builder, connectionString, connectionStringModulle1);

InitialisierenFunktionfähigkeitPrüfung(builder, connectionString, connectionStringModulle1);

//IdentityAuthentifizierung(builder);

//KerberosAuthentifizierung(builder);

NegotiateAuthentifizierung(builder);

builder.Services
    .AddControllersWithViews()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = null;
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
builder.Services.AddRazorPages();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Portal.Api", Version = "v1" });
    c.EnableAnnotations();
});

builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portal.Api v1");
    });
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// Moderne Health Checks Konfiguration (.NET 8/9/10)
// Liveness Probe: Nur essentielle Checks (Applikation läuft)
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false // Keine externen Abhängigkeiten prüfen
}).AllowAnonymous();

// Readiness Probe: Alle produktionsrelevanten Checks
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("production"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
}).AllowAnonymous();

// Vollständige Health Checks mit UI Support
app.MapHealthChecks("/healthchecks", new HealthCheckOptions
{
    Predicate = _ => true,
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
}).AllowAnonymous();

// Health Checks UI Dashboard
app.MapHealthChecksUI(setup =>
{
    setup.SetEvaluationTimeInSeconds(15);
    setup.MaximumHistoryEntriesPerEndpoint(60);
    setup.SetApiMaxActiveRequests(1);
    setup.AddHealthCheckEndpoint("Portal Health", "/healthchecks");
    setup.AddCustomStylesheet(@"wwwroot/css/healthcheckui.css");
    setup.AsideMenuOpened = false;
}).AllowAnonymous();

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Eintritt}/{action=Index}/{id?}"
);

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);
app.MapRazorPages();

app.MigrateDatabase();

app.Run();

static void InitialisierungDatenbanken(WebApplicationBuilder builder, string connectionString, string connectionStringModulle1)
{
    var serverVersion = new MySqlServerVersion(version: new Version(12, 6, 4));

    if (connectionString != null)
    {
        builder.Services.AddDbContext<ApplikationDbContext>(options =>
            options.UseMySql(connectionString, serverVersion)
            //UNDONE Nur für Entwicklung, nicht für Produktion
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
        );
    }

    if (connectionStringModulle1 != null)
    {
        builder.Services.AddDbContext<Modulle1DbContext>(options =>
            options.UseMySql(connectionStringModulle1, serverVersion, options => options.MigrationsAssembly("Speicher"))
            //UNDONE Nur für Entwicklung, nicht für Produktion
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging()
            .EnableDetailedErrors()
        );
    }

    builder.Services.AddDatabaseDeveloperPageExceptionFilter();
}

static void InitialisierenFunktionfähigkeitPrüfung(WebApplicationBuilder builder, string connectionString, string connectionStringModulle1)
{
    var dllname = typeof(Program).Assembly.GetName().Name ?? "Applikation";

    // Health Checks UI Konfiguration
    builder.Services
        .AddHealthChecksUI(setup =>
        {
            setup.SetEvaluationTimeInSeconds(15);
            setup.MaximumHistoryEntriesPerEndpoint(60);
            setup.SetApiMaxActiveRequests(1);
            setup.AddHealthCheckEndpoint(dllname, "/healthchecks");
        })
        .AddInMemoryStorage();

    // Health Checks Registrierung mit Tags für Kubernetes Probes
    builder.Services
        .AddHealthChecks()
        .AddMySql(connectionString, name: "Datenbank Portal", failureStatus: Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy, tags: new[] { "production", "db" })
        .AddMySql(connectionStringModulle1, name: "Datenbank Modulle1", failureStatus: Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Unhealthy, tags: new[] { "production", "db" });
}

static void KerberosAuthentifizierung(WebApplicationBuilder builder)
{
    builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
        .AddNegotiate(options =>
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            {
                options.EnableLdap(settings =>
                {
                    settings.Domain = "192.168.2.1";
                });
            }
        });

    builder.Services.AddAuthorization(options =>
    {
        options.FallbackPolicy = options.DefaultPolicy;
    });
}

static void NegotiateAuthentifizierung(WebApplicationBuilder builder)
{
    builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
       .AddNegotiate();

    builder.Services.AddAuthorization(options =>
    {
        options.FallbackPolicy = options.DefaultPolicy;
    });
}

static void IdentityAuthentifizierung(WebApplicationBuilder builder)
{
    //Identity
    builder.Services
        .AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
        .AddEntityFrameworkStores<ApplikationDbContext>();
}
