# Git - Leitfaden für VS Code-Alltag. 

Hier ist ein kompakter und praxisorientierter Leitfaden mit den wichtigsten Git-Befehlen für deinen VS Code-Alltag. 

---

### 1. Neues lokales Projekt in ein leeres GitHub-Repo pushen

Du hast einen neuen Ordner in VS Code geöffnet, Code geschrieben und ein leeres Repository auf GitHub erstellt.

**Tipp zur `.gitignore`:** Bevor du Git initialisierst, erstelle eine Datei namens `.gitignore` im Hauptverzeichnis. Du kannst dir fertige Templates (z.B. für Node, Python, Java) auf [gitignore.io](https://gitignore.io) generieren lassen oder in VS Code die Erweiterung "gitignore" nutzen.

Öffne das integrierte Terminal in VS Code (`Ctrl + ~` bzw. `Strg + Ö`) und gib Folgendes ein:

```bash
# 1. Git im aktuellen Verzeichnis initialisieren
git init

# 2. Alle Dateien (inklusive .gitignore) zum Staging hinzufügen
git add .

# 3. Den ersten Commit erstellen
git commit -m "Initial commit"

# 4. Den Standard-Branch auf "main" umbenennen (früher oft "master")
git branch -M main

# 5. Das lokale Repo mit dem leeren GitHub-Repo verknüpfen
# (Die URL bekommst du auf GitHub, wenn du das Repo erstellst)
git remote add origin https://github.com/DeinName/DeinRepo.git

# 6. Den Code hochladen und den Branch verknüpfen (-u)
git push -u origin main
```

---

### 2. Ein bestehendes GitHub-Repo in VS Code klonen

Du möchtest an einem Projekt arbeiten, das bereits auf GitHub existiert.

```bash
# 1. Repo ins aktuelle Verzeichnis klonen
git clone https://github.com/DeinName/DeinRepo.git

# 2. In den neuen Ordner wechseln
cd DeinRepo

# Tipp: Öffne den Ordner direkt im selben VS Code Fenster
code . -r 
```

---

### 3. An einem neuen Feature arbeiten (Branching)

Arbeite nie direkt auf dem `main`-Branch. Erstelle für jede Aufgabe einen eigenen Branch.

```bash
# 1. Neuen Branch erstellen und direkt dorthin wechseln
git switch -c feature/mein-neues-feature
# (Alternative: git checkout -b feature/mein-neues-feature)

# ... jetzt machst du deine Änderungen im VS Code ...

# 2. Geänderte Dateien hinzufügen
git add .

# 3. Änderungen committen
git commit -m "Füge neues Feature XY hinzu"

# 4. Den neuen Branch das erste Mal auf GitHub pushen
git push -u origin feature/mein-neues-feature
```

---

### 4. Pull Request (PR) erstellen und mergen

Git selbst kennt keine "Pull Requests", das ist ein Konzept von Plattformen wie GitHub. 

**Der normale Weg (im Browser):**
1. Gehe auf die GitHub-Seite deines Repositories.
2. GitHub erkennt meist automatisch deinen neuen Branch und zeigt einen grünen Button **"Compare & pull request"**. Klicke darauf.
3. Fülle Titel und Beschreibung aus und klicke auf **"Create pull request"**.
4. Nach dem Review klickst du auf **"Merge pull request"**.

**Der Pro-Weg (direkt in VS Code):**
Wenn du die **GitHub CLI (`gh`)** installiert hast, kannst du das alles direkt im VS Code Terminal machen:

```bash
# PR erstellen
gh pr create --title "Mein neues Feature" --body "Beschreibung der Änderungen"

# PR mergen (wenn alle Tests grün sind und er freigegeben ist)
gh pr merge
```

---

### 5. Aufräumen (Branches löschen)

Nachdem der PR gemergt wurde, brauchst du den Feature-Branch nicht mehr. Auf GitHub gibt es oft einen Button "Delete branch", aber lokal musst du auch aufräumen.

```bash
# 1. Zurück auf den main-Branch wechseln
git switch main

# 2. Den lokalen main-Branch auf den neuesten Stand bringen (holt den Merge!)
git pull

# 3. Den lokalen Feature-Branch löschen
git branch -d feature/mein-neues-feature

# 4. Falls du den Remote-Branch NICHT über den GitHub-Browser gelöscht hast:
git push origin --delete feature/mein-neues-feature
```

---

**Ein kleiner Tipp für VS Code:** Viele dieser Schritte kannst du auch ohne Terminal über das Icon **"Quellverwaltung" (Source Control)** in der linken Seitenleiste von VS Code (oder `Ctrl + Shift + G`) erledigen. Dort kannst du Dateien per Klick stagen (`+`), Commit-Nachrichten eingeben und Branches erstellen.
