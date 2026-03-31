# Entity Framework Core
## Original LinkedIn Artikel
[𝟭𝟮 𝗘𝗙 𝗖𝗼𝗿𝗲 𝗔𝗻𝘁𝗶-𝗣𝗮𝘁𝘁𝗲𝗿𝗻𝘀 𝗞𝗶𝗹𝗹𝗶𝗻𝗴 𝗬𝗼𝘂𝗿 𝗔𝗦𝗣.𝗡𝗘𝗧 𝗖𝗼𝗿𝗲 𝗔𝗽𝗽𝘀](https://www.linkedin.com/posts/anton-martyniuk_ef-core-anti-patterns-activity-7414569049558302720-FYUf?utm_source=share&utm_medium=member_desktop&rcm=ACoAAATZNKEBLTk1oatjVXee5kBJc-APUloWUpE)  

I've optimized over 20 enterprise .NET applications and seen the same mistakes in EF Core repeatedly.

Many teams blame EF Core when performance drops.

But most problems come from how EF Core is used, not from EF Core itself.

👉 Here are 12 EF Core anti-patterns killing your .NET apps in production.

❌ 1. Not Disposing DbContext
→ DbContext is not thread-safe and keeps tracked entities forever.
→ This causes memory leaks, race conditions, and stale data bugs.

Fix: Register DbContext as Scoped or dispose manually.

❌ 2. Ignoring AsNoTracking() for read-only queries
→ Tracking every entity increases memory usage and CPU cost.

Fix: Use AsNoTracking() for read-only queries

❌ 3. Using Lazy Loading
→ Lazy loading often creates N+1 queries without you noticing.
→ At scale, this quietly destroys database performance.

Fix: avoid lazy loading

❌ 4. Overusing Include() everywhere
→ Include() loads entire object graphs even when unnecessary.
→ Most endpoints only need a small subset of related data.

Fix: Load only required relationships or use projections instead.

❌ 5. Calling SaveChanges() inside loops
→ Each call creates a separate database roundtrip.
→ This kills throughput and increases transaction overhead.

Fix: Batch changes and call SaveChanges() once per unit of work.

❌ 6. Missing indexes and blaming EF Core
→ Slow queries are often missing indexes, not ORM problems.
→ Always inspect execution plans before blaming EF Core.

Fix: Analyze query plans and add proper database indexes.

❌ 7. Not using projections
→ Returning full entities forces EF Core to materialize everything.
→ Select only the fields you actually need.

Fix: Use Select() to project only needed fields into DTOs.

❌ 8. Overfetching too many rows
→ Extra rows waste memory, CPU, and network bandwidth.
→ This hurts every single request under load.

Fix: Fetch minimal data required for each use case.

❌ 9. Ignoring concurrency handling
→ Without concurrency tokens, updates overwrite each other silently.
→ This leads to data loss and hard-to-debug production issues.

Fix: Use concurrency tokens like RowVersion or timestamps.

❌ 10. Not using migrations
→ Manual schema changes drift over time and break deployments.
→ Migrations keep database evolution predictable and safe.

Fix: Use EF Core migrations to version and evolve schemas safely.

❌ 11. Skipping async APIs
→ Blocking threads limits scalability under traffic spikes.

Fix: Use async EF Core APIs end to end.

❌ 12. Using EF Core for bulk updates blindly
→ EF Core is not optimized for large bulk operations.

Fix: use Entity Framework Core Extensions library

👉 Get .NET interview questions for free here:
↳ https://lnkd.in/d3J4wnSN

——

♻️ Repost to help others avoid common EF Core mistakes

➕ Follow me ( Anton Martyniuk ) to improve your .NET and Architecture Skills