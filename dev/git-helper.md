# Git & GitHub Workflow in VS Code

Dieser Leitfaden deckt die typischen Entwickler-Aufgaben direkt aus VS Code und dem integrierten Terminal ab, inklusive der Nutzung der GitHub CLI (`gh`).

---

## 1. Neues Projekt in ein leeres GitHub-Repo pushen

Du hast einen neuen Ordner in VS Code geöffnet, Code geschrieben und ein leeres Repository auf GitHub erstellt. 

**Wichtig vorab:** Erstelle eine `.gitignore`-Datei im Hauptverzeichnis (Nutze dafür z.B. [gitignore.io](https://gitignore.io) oder die VS Code Erweiterung "gitignore"), damit keine unnötigen Dateien wie `node_modules` hochgeladen werden.

```bash
# Git im aktuellen Verzeichnis initialisieren
git init

# Alle Dateien (inklusive .gitignore) zum Staging hinzufügen
git add .

# Den ersten Commit erstellen
git commit -m "Initial commit"

# Den Standard-Branch auf "main" benennen
git branch -M main

# Das lokale Repo mit dem leeren GitHub-Repo verknüpfen (URL anpassen)
git remote add origin https://github.com/DeinName/DeinRepo.git

# Den Code hochladen und den Branch verknüpfen
git push -u origin main
```

---

## 2. Bestehendes GitHub-Repo klonen

Du möchtest an einem Projekt arbeiten, das bereits auf GitHub existiert.

```bash
# Repo ins aktuelle Verzeichnis klonen
git clone https://github.com/DeinName/DeinRepo.git

# In den neuen Ordner wechseln
cd DeinRepo

# Den Ordner direkt im selben VS Code Fenster öffnen
code . -r 
```

---

## 3. Feature-Branch erstellen

Arbeite nie direkt auf dem `main`-Branch. Erstelle für jede neue Aufgabe einen eigenen Branch.

```bash
# Neuen Branch erstellen und direkt dorthin wechseln
git switch -c feature/mein-neues-feature

# ... Code in VS Code bearbeiten und speichern ...

# Geänderte Dateien hinzufügen
git add .

# Änderungen committen
git commit -m "Füge neues Feature XY hinzu"

# Den neuen Branch auf GitHub pushen
git push -u origin feature/mein-neues-feature
```

---

## 4. Pull Request (PR) erstellen und verwalten

Mit der installierten GitHub CLI (`gh`) kannst du PRs direkt im VS Code Terminal abwickeln. (Voraussetzung: Einmaliger Login mit `gh auth login`).

```bash
# PR interaktiv im Terminal erstellen
gh pr create

# Status der automatischen Tests und Reviews prüfen
gh pr status

# PR mergen (wenn alles freigegeben ist)
gh pr merge
```
*Tipp:* Nutze `gh pr create --web`, falls du den PR lieber im Browser fertigstellen möchtest (z.B. für Screenshots in der Beschreibung).

---

## 5. Merge-Konflikte auflösen

Ein Konflikt entsteht, wenn Git Änderungen nicht automatisch zusammenführen kann (z.B. nach einem `git pull` oder beim Mergen). 

**Schritt 1: Dateien in VS Code identifizieren**
Wechsle in die Ansicht **"Quellverwaltung"** (`Ctrl + Shift + G`). Konflikt-Dateien sind rot mit einem "C" markiert. Öffne diese Dateien.

**Schritt 2: Konflikt im Editor lösen**
VS Code markiert die Problemstellen farbig. Du siehst deine lokalen Änderungen (`Current Change`) und die hereinkommenden Änderungen (`Incoming Change`).
Klicke auf einen der CodeLens-Buttons direkt über dem Konflikt:
* **Accept Current Change:** Behält deine Version.
* **Accept Incoming Change:** Behält die reinkommende Version.
* **Accept Both Changes:** Behält beide Versionen.

**Schritt 3: Konflikt-Lösung bestätigen**
Speichere die reparierte Datei (`Ctrl + S`).
Füge die Datei zum Staging hinzu und schließe den Merge mit einem Commit ab:

```bash
# Datei stagen
git add konfliktdatei.js

# Merge abschließen (Git generiert oft automatisch eine passende Nachricht)
git commit -m "Löse Merge-Konflikte"
```

---

## 6. Aufräumen (Branches löschen)

Nachdem dein PR erfolgreich gemergt wurde, sollte der lokale Feature-Branch gelöscht werden, um Ordnung zu halten.

```bash
# Zurück auf den main-Branch wechseln
git switch main

# Den lokalen main-Branch auf den neuesten Stand bringen
git pull

# Den lokalen Feature-Branch löschen
git branch -d feature/mein-neues-feature

# Den Remote-Branch löschen (falls nicht schon über GitHub passiert)
git push origin --delete feature/mein-neues-feature
```

---

## 7. Mehrere GitHub-Accounts & Profile verwalten

Wenn du private und geschäftliche Repositories auf demselben Rechner nutzt, trennst du sie am besten so:

### Account-Wechsel im Terminal (GitHub CLI)
Füge deinen zweiten Account mit `gh auth login` hinzu. Danach kannst du jederzeit wechseln:

```bash
# Interaktiv zwischen Accounts wechseln
gh auth switch

# Git anweisen, die Anmeldedaten der GitHub CLI zu nutzen (einmalig ausführen)
gh auth setup-git
```

### Automatische Git-Profile nach Ordner (`includeIf`)
Damit deine Commits immer die richtige E-Mail-Adresse haben, kannst du Git anweisen, je nach Ordnerpfad ein anderes Profil zu laden.

1. Erstelle eine Datei für das Arbeits-Profil (z.B. `~/.gitconfig-arbeit`) mit folgendem Inhalt:
   ```ini
   [user]
       name = Dein Arbeitsname
       email = dev@deine-firma.de
   ```

2. Öffne deine globale Git-Konfiguration (`~/.gitconfig`) und füge ganz unten diesen Block hinzu:
   ```ini
   [includeIf "gitdir:~/Dev/Arbeit/"]
       path = ~/.gitconfig-arbeit
   ```
*(Wichtig: Der abschließende Schrägstrich `/` im Pfad ist zwingend erforderlich. Sobald du nun in `~/Dev/Arbeit/` arbeitest, nutzt Git automatisch deine geschäftliche E-Mail).*
