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

---

# Entity Framework Core - Deutsche Übersetzung

## Originalquellen LinkedIn Artikel
[𝟭𝟮 𝗘𝗙 𝗖𝗼𝗿𝗲 𝗔𝗻𝘁𝗶-𝗠𝘂𝘀𝘁𝗲𝗿 𝗞𝗶𝗟𝗟𝗲𝗻 𝗗𝗜𝗉𝘀𝘁𝗲 𝗔𝗦𝗣.𝗡𝗘𝗧 𝗞𝗲𝗿𝗻-𝗔𝗻𝘄𝗲𝗻𝗱𝘂𝗻𝗴𝗲𝗻](https://www.linkedin.com/posts/anton-martyniuk_ef-core-anti-patterns-activity-7414569049558302720-FYUf?utm_source=share&utm_medium=member_desktop&rcm=ACoAAATZNKEBLTk1oatjVXee5kBJc-APUloWUpE)

Ich habe über 20 enterprise .NET-Anwendungen optimiert und sehe immer wieder die gleichen Fehler in EF Core.

Viele Teams geben EF Core die Schuld, wenn die Leistung sinkt.

Aber die meisten Probleme entstehen durch die Art und Weise, wie EF Core verwendet wird, nicht durch EF Core selbst.

👉 Hier sind 12 EF Core Anti-Muster, die Ihre .NET-Apps in der Produktion zerstören.

❌ 1. DbContext nicht freigeben
→ DbContext ist nicht threadsicher und behält verfolgte Entitäten unbegrenzt.
→ Dies verursacht Speicherlecks, Race Conditions und veraltete Datenfehler.

Behebung: Registrieren Sie DbContext als Scoped oder geben Sie es manuell frei.

❌ 2. AsNoTracking() für schreibgeschützte Abfragen ignorieren
→ Das Verfolgen jeder Entität erhöht die Speichernutzung und CPU-Kosten.

Behebung: Verwenden Sie AsNoTracking() für schreibgeschützte Abfragen.

❌ 3. Lazy Loading verwenden
→ Lazy Loading erstellt oft N+1-Abfragen ohne dass Sie es bemerken.
→ Bei großem Maßstab zerstört dies stillschweigend die Datenbankleistung.

Behebung: Vermeiden Sie Lazy Loading.

❌ 4. Include() überall übernutzen
→ Include() lädt ganze Objektgraphen auch wenn unnötig.
→ Die meisten Endpunkte benötigen nur eine kleine Teilmenge verwandter Daten.

Behebung: Laden Sie nur erforderliche Beziehungen oder verwenden Sie Projektionen stattdessen.

❌ 5. SaveChanges() in Schleifen aufrufen
→ Jeder Aufruf erstellt einen separaten Datenbank-Roundtrip.
→ Dies zerstört den Durchsatz und erhöht den Transaktionsaufwand.

Behebung: Stapeln Sie Änderungen und rufen Sie SaveChanges() einmal pro Arbeitseinheit auf.

❌ 6. Fehlende Indizes und EF Core beschuldigen
→ Langsame Abfragen sind oft das Ergebnis fehlender Indizes, nicht ORM-Probleme.
→ Überprüfen Sie immer Ausführungspläne, bevor Sie EF Core beschuldigen.

Behebung: Analysieren Sie Abfragepläne und fügen Sie ordnungsgemäße Datenbankindizes hinzu.

❌ 7. Keine Projektionen verwenden
→ Das Zurückgeben vollständiger Entitäten zwingt EF Core, alles zu materialisieren.
→ Wählen Sie nur die Felder aus, die Sie tatsächlich benötigen.

Behebung: Verwenden Sie Select() um nur benötigte Felder in DTOs zu projizieren.

❌ 8. Zu viele Zeilen abrufen
→ Zusätzliche Zeilen verschwenden Speicher, CPU und Netzwerkbandbreite.
→ Dies schadet jedem einzelnen Request unter Last.

Behebung: Rufen Sie nur die für jeden Anwendungsfall erforderlichen minimalen Daten ab.

❌ 9. Nebenläufigkeitsbehandlung ignorieren
→ Ohne Nebenläufigkeitstoken überschreiben sich Aktualisierungen stillschweigend gegenseitig.
→ Dies führt zu Datenverlust und schwer zu debuggenden Produktionsproblemen.

Behebung: Verwenden Sie Nebenläufigkeitstoken wie RowVersion oder Zeitstempel.

❌ 10. Keine Migrationen verwenden
→ Manuelle Schemaänderungen driften im Laufe der Zeit ab und unterbrechen Bereitstellungen.
→ Migrationen halten die Datenbankentwicklung vorhersehbar und sicher.

Behebung: Verwenden Sie EF Core-Migrationen, um Schemas sicher zu versionieren und zu entwickeln.

❌ 11. Async APIs überspringen
→ Blockierende Threads begrenzen die Skalierbarkeit bei Traffic-Spitzen.

Behebung: Verwenden Sie async EF Core APIs durchgängig.

❌ 12. EF Core für Massen-Updates blind verwenden
→ EF Core ist nicht für große Massen-Operationen optimiert.

Behebung: Verwenden Sie Entity Framework Core Extensions Library

👉 Holen Sie sich kostenlos .NET-Interviewfragen hier:
↳ https://lnkd.in/d3J4wnSN

——

♻️ Teilen Sie dies, um anderen zu helfen, häufige EF Core-Fehler zu vermeiden

➕ Folgen Sie mir (Anton Martyniuk), um Ihre .NET- und Architektur-Fähigkeiten zu verbessern