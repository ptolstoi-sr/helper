# C#
## .NET Core
### sync - async
```
// Synchronous method
void Method()
{
    var task = MethodAsync();
    var result = task.Result;
}

// Asynchronous method
public async Task<int> MethodAsync()
{
    return await Task.Run(() => { return 1; });
}
```
### AutoMapper
#### Core App
```
...
builder.Services.AddRazorPages();
...
builder.Services.AddScoped<Project.Application.Mapping.IMappingService, Project.Application.Mapping.MappingService>();
...
var app = builder.Build();
...
```
#### Application
##### IMappingService
```
using AutoMapper;
namespace Project.Application.Mapping;
public interface IMappingService
{
    IMapper IMapper { get; }
}
```
##### MappingService
```
using AutoMapper;
namespace Project.Application.Mapping;
public class MappingService : IMappingService
{
    private IMapper _iMapper;
    public MappingService()
    {
        var assembly = typeof(MappingService).Assembly;
        var configuration = new MapperConfiguration(cfg => cfg.AddMaps(assembly));
        _iMapper = configuration.CreateMapper();
    }
    public IMapper IMapper => _iMapper;
}
```
##### MappingProfils
```
using AutoMapper;
using Project.Application.QM.Modelle;
using Project.Domain.Qm.Aggregate.MaßnahmeAggregat;

namespace Project.Application.MappingProfils;
public class {Entity}Profil : Profile
{
    public {Entity}Profil()
    {
        AllowNullCollections = true;

        CreateMap<{Entity}, {EntityModel}>().ReverseMap();
    }
}
```
