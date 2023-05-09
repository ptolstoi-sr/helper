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
