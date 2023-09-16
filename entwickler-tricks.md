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
### Lazy 
[Async Lazy In C# – With Great Power Comes Great Responsibility](https://www.codeproject.com/Articles/5366567/Async-Lazy-In-Csharp-With-Great-Power-Comes-Great)  
```
public class AsyncLazy<T> : Lazy<Task<T>>
{
    public AsyncLazy(Func<T> valueFactory) :
        base(() => Task.Run(valueFactory))
    { }

    public AsyncLazy(Func<Task<T>> taskFactory) :
        base(() => Task.Run(() => taskFactory()).Unwrap())
    { }
}
...
AsyncLazy<MyClass> myObject = new AsyncLazy<MyClass>(() => new MyClass());
// later...
MyClass result = await myObject.Value;
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
using Project.Application.Models;
using Project.Domain.Aggregates.{Entity}Agregate;

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
##### Mapping DataTable to List of Objects
```
        /*Converts DataTable To List*/
        public static List<TSource> ToList<TSource>(this DataTable dataTable) where TSource : new()
        {
            var dataList = new List<TSource>();

            const BindingFlags flags = BindingFlags.Public | BindingFlags.Instance | BindingFlags.NonPublic;
            var objFieldNames = (from PropertyInfo aProp in typeof(TSource).GetProperties(flags)
                                 select new
                                 {
                                     Name = aProp.Name,
                                     Type = Nullable.GetUnderlyingType(aProp.PropertyType) ?? aProp.PropertyType
                                 }).ToList();

            var dataTblFieldNames = (from DataColumn aHeader in dataTable.Columns
                                     select new
                                     {
                                         Name = aHeader.ColumnName,
                                         Type = aHeader.DataType
                                     }).ToList();

            var commonFields = objFieldNames.Intersect(dataTblFieldNames).ToList();

            foreach (DataRow dataRow in dataTable.AsEnumerable().ToList())
            {
                var aTSource = new TSource();
                foreach (var aField in commonFields)
                {
                    PropertyInfo propertyInfos = aTSource.GetType().GetProperty(aField.Name);
                    var value = (dataRow[aField.Name] == DBNull.Value) ? null : dataRow[aField.Name]; //if database field is nullable
                    propertyInfos.SetValue(aTSource, value, null);
                }

                dataList.Add(aTSource);
            }

            return dataList;
        }
```
# Javascript
## Lazy
[jQuery Lazy](http://jquery.eisbehr.de/lazy/)  
[yall.js (Yet Another Lazy Loader)](https://github.com/malchata/yall.js)  
[lazysizes - High performance and SEO friendly lazy loader for images (responsive and normal), iframes and more, that detects any visibility changes triggered through user interaction, CSS or JavaScript without configuration.](https://github.com/aFarkas/lazysizes)  
