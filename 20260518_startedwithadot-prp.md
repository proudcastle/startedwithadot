# It All Started With a Dot — Product Requirements Prompt (PRP)

## Projektübersicht

Baue eine Community-Plattform mit eingebettetem Spiel namens **"It All Started With a Dot"** — ein kollaboratives Experiment, bei dem ein Spiel aus einem einzelnen schwarzen Punkt entsteht, gesteuert durch Community-Vorschläge und Voting.

**Kernidee:** Das Spiel startet als schwarzer Punkt auf Canvas. Registrierte Nutzer reichen Vorschläge ein ("Der Punkt soll sich bewegen", "Der Punkt soll auf Klick die Farbe wechseln"), die Community voted, der Ersteller kuratiert und implementiert die besten Vorschläge. Jede Implementierung = eine neue Version. Das Spiel evolviert organisch durch seine Community.

**Sprache:** Das gesamte Projekt ist **vollständig auf Englisch** — alle UI-Texte, Micro-Copy, Fehlermeldungen, Platzhalter, Meta-Tags, Code-Kommentare, Commit-Messages. Keine deutschen Texte in der Codebase oder auf der Seite. Dieses PRP ist auf Deutsch weil es ein internes Planungsdokument ist — alles was Claude Code produziert ist Englisch.

**Ton & Vibe:** Pixel-Art-Ästhetik trifft auf radikale Einfachheit. Die UI sagt sofort "Spiel" — pixelige Borders, 8-Bit-Komponenten, Retro-Feeling. Aber der Dot selbst ist clean und geometrisch perfekt: ein makelloser Kreis auf schwarzem Grund. Dieser Kontrast ist bewusst — die Hülle sagt "Game", der Inhalt ist noch ein unbeschriebenes Blatt. Beides evolviert durch die Community.

**Sprachstil: "Sloppy Narrator"**

Die gesamte Seite spricht in der Stimme eines selbstbewussten, leicht gelangweilten Erzählers — wie der Main Character in einem 80s/90s-Film der sich direkt an den Zuschauer wendet. Denke Ferris Bueller ("Life moves pretty fast..."), Fight Club Narrator, Deadpool. Die Stimme bricht die vierte Wand, ist casual bis sloppy, selbstironisch, und behandelt die eigene Absurdität (ein Spiel das nur ein Punkt ist) als völlig normal.

Regeln für den Sprachstil:
- **Kurze Sätze. Fragments. Okay.** — Keine perfekte Grammatik nötig.
- **Direkte Ansprache.** Der Dot/die Seite redet mit dem Besucher wie mit einem Kumpel.
- **Selbstironie.** "Yeah, I know. It's just a dot. But hear me out."
- **Beiläufige Grandiosität.** Große Claims, casual vorgetragen. "This might be the most democratic game ever made. Or not. We'll see."
- **Englisch.** Die gesamte Seite ist auf Englisch — das Projekt zielt auf eine internationale Community.
- **Kein Marketing-Sprech.** Keine "revolutionize", "empower", "leverage". Stattdessen: "Look, here's the deal."

**Tech Stack:**
- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- 8bitcn/ui (Pixel-Art Component Library, shadcn-basiert)
- Supabase (Auth, PostgreSQL, Realtime)
- HTML5 Canvas für den Game-Layer
- Deployment auf Vercel (Pro)
- Domain: startedwithadot.com

---

## Design-Richtung

### Ästhetik: "8-Bit Monochrome"

Die UI nutzt **8bitcn/ui** als Component-Basis — eine shadcn-kompatible Pixel-Art-Library. Alle UI-Elemente (Cards, Buttons, Inputs, Badges, Navigation) kommen aus 8bitcn und bringen die Retro-Ästhetik out-of-the-box mit: pixelige Borders, kastige Ecken, Bitmap-Charakter.

- **Dark Theme** — reines Schwarz (#000000) als Canvas-Hintergrund, sehr dunkles Grau (#0a0a0a / #111111) für UI-Chrome
- **Monochrom:** Schwarz, Weiß, Graustufen. Kein Farbakzent. Interaktive Elemente (Buttons, Vote-Counts, Links) heben sich durch Helligkeit ab (Weiß auf Schwarz), nicht durch Farbe. Das Fehlen von Farbe ist ein Statement — Farbe kommt wenn die Community sie einführt.
- **Typographie:** Pixel-Font / Monospace für Headlines und UI-Labels (passend zur 8bitcn-Ästhetik). Body-Text darf lesbarer sein (geometric sans-serif wie Inter oder eine cleane Monospace wie JetBrains Mono). Kontrast zwischen "Game-UI" und "lesbarem Content".
- **Layout:** Reduziert. Der Dot bekommt den Hero-Bereich (Fullscreen oder nahe dran). Proposals darunter als Karten-Grid. Changelog als Timeline. Viel Blackspace.
- **Zwei visuelle Welten:**
  - **Die UI-Chrome** (Navigation, Cards, Buttons, Footer) → 8bitcn Pixel-Art-Komponenten, monochrom, sofort als "Spiel" erkennbar
  - **Der Game-Canvas** → Clean, anti-aliased, geometrisch perfekt. Kein Pixel-Filter. Der Dot ist ein makelloser Kreis. Dieser Bereich ist "heilig" — er verändert sich nur durch Community-Entscheidungen, nicht durch UI-Styling.
- **Animationen:** Minimal. Der Dot darf subtil pulsieren (er "lebt"). UI-Transitions nur funktional. Keine Spielereien — die Pixel-Ästhetik trägt sich selbst.

### Was es NICHT sein soll:
- Nicht bunt — monochrom ist Pflicht bis die Community Farbe einführt
- Nicht überladen — 8bitcn-Komponenten sind charmant, aber sparsam einsetzen
- Keine generische SaaS-Landing-Page
- Keine Stock-Bilder, keine Illustrationen
- Der Game-Canvas bekommt KEINE Pixel-Art-Filter — er bleibt neutral

---

## Seitenstruktur

### 1. Hero / The Dot (Startseite)

Der gesamte obere Bereich ist der **Dot** — ein schwarzer Fullscreen-Canvas mit einem einzelnen weißen Punkt in der Mitte. Darunter die Kernbotschaft im Sloppy-Narrator-Stil:

**Primärtext (groß, direkt unter/über dem Dot):**
> "Yes. This is a dot. And no, it doesn't do anything."

**Sekundärtext (kleiner, darunter):**
> "Not yet, anyway. But here's the thing — you get to decide what happens next."

**CTA:** "Change it →" → Führt zum Proposal-Bereich (oder Auth-Gate wenn nicht eingeloggt)

**Versionsnummer:** Dezent in der Ecke: "v0.1 ● A Dot." — verlinkt zum Changelog.

---

### 1b. "The Story" / Konzept-Erklärung

Direkt unter dem Hero, bevor die Proposals kommen. Eine kompakte Erklärung des Konzepts im Sloppy-Narrator-Stil. Visuell abgesetzt (leicht anderer Hintergrund-Ton oder Rahmen), aber nicht als eigene Seite — inline auf der Landing Page.

**Vorgeschlagener Text (Claude Code darf Feinschliff machen, aber der Vibe muss bleiben):**

> **"So here's the deal."**
>
> This is a game. Right now it's just a dot on a screen. Pretty underwhelming, I know.
>
> But this dot? It's yours. Well, not yours *yours* — it belongs to everyone who shows up here.
>
> Here's how it works: You tell us what the dot should do. Move? Sure. Change color? Why not. Grow legs and fight aliens? ...we'll talk about it.
>
> Everyone votes. The best ideas get built. The dot evolves. Repeat.
>
> No roadmap. No game design document. No five-year plan. Just a dot, a community, and whatever happens next.
>
> Could be the most community-driven game ever made. Could also be a dot forever. Honestly? Both outcomes are fine.

**Unter dem Text, als kompakte Schritte (3 Dots als Nummerierung):**

> ● Register — takes 30 seconds, we only need an email
>
> ● Propose — tell us what the dot should do (140 characters, make it count)
>
> ● Vote — the best ideas rise to the top, then we build them

---

### 2. Proposals & Voting (Hauptbereich)

**Überschrift:** "Alright, what should happen next?"

**Design-Prinzip:** Denke an die erste Twitter-Version. Ein Eingabefeld, ein Button, eine Timeline. Radikal einfach.

**Die Proposal-Timeline:** Eine vertikale Liste von Vorschlägen, neueste oben. Jeder Vorschlag ist eine kompakte Zeile/Karte:

- **Text** des Vorschlags (max. **140 Zeichen** — bewusst limitiert, erzwingt Klarheit)
- **Username** des Erstellers
- **Zeitstempel** ("2h ago", "3d ago")
- **Dot-Counter:** Upvotes werden als **Dots (●)** dargestellt, nicht als Zahl. Kleine ausgefüllte Kreise, die sich aneinanderreihen. Ab einer bestimmten Anzahl (z.B. >10) wechselt die Darstellung zu "●●●●● 47" (Dot-Row + Zahl). Der Dot ist das Vote-Icon UND der visuelle Akzent.
- **Status-Indikator:** Ein einzelner Dot in verschiedenen Zuständen: ○ Open / ● Accepted / ◉ Implemented / ○̶ Rejected (durchgestrichen)

**Eingabe:** Ein einzelnes Textfeld mit Zeichenzähler (wie Twitter), darunter ein Submit-Button. Kein Titel/Beschreibung-Split, kein Modal — inline, direkt in der Timeline.

**Vote-Interaktion:** Klick auf den Dot-Counter toggelt den eigenen Vote. Der eigene Dot wird visuell hervorgehoben.

**Sortierung:** Nach Votes (meiste Dots zuerst), mit Tab-Filter: All / Open / Accepted / Implemented

**Auth-Gate:** Proposals einreichen und Voten erfordert einen Account. Ansehen ist ohne Account möglich.

**Rate Limiting:** Max. 3 Proposals pro User pro Tag (verhindert Spam, erzwingt Qualität).

---

### 3. Changelog / Version History

**Überschrift:** "The Evolution"
**Subtext:** "Everything that happened so far. Which isn't much. Yet."

Eine chronologische Liste aller implementierten Versionen, neueste zuerst:

- **Versionsnummer** (v0.1, v0.2, ...)
- **Titel** (was sich geändert hat, 1 Satz)
- **Datum**
- **Basiert auf Vorschlag von:** (Username, verlinkt zum Original-Proposal)
- **Kurze Beschreibung** der Änderung

Jeder Eintrag ist eine Karte oder ein Timeline-Element.

**Phase 1:** Rein informativ, nicht spielbar. Alte Versionen werden als Text dokumentiert.
**Später (Phase 2+):** Alte Versionen spielbar machen als Supporter-Feature.

---

### 4. Auth

**Registrierung:** Email + Passwort. Kein Social Login in V1 — Reduktion.

**Profil:** Minimal:
- Username (selbst gewählt, unique, unveränderlich)
- Email
- Registrierungsdatum
- Anzahl eingereichter Vorschläge
- Anzahl implementierter Vorschläge (als "Impact Score" oder ähnlich)

**Kein öffentliches Profil in V1.** Die Community sieht nur den Username auf Proposals.

---

### 5. Footer

Minimal, im Narrator-Stil:
- "It All Started With a Dot. © 2026. Obviously."
- "No cookies were harmed in the making of this dot." (oder ähnlich sloppy)
- Link zu Changelog
- Link zu Impressum / Privacy Policy (Pflicht wegen Auth/Email-Speicherung)
- Optional: Link zu Reddit / Social Media (wenn vorhanden)

---

### Der Dot als wiederkehrendes visuelles Element

Der Punkt/Kreis (●) ist das visuelle DNA der gesamten Seite. Er taucht überall als Motiv auf:

- **Vote-Indikator:** Upvotes sind Dots (●), nicht Zahlen
- **Status-Indikator:** Proposal-Status als Dot-Varianten (○ ● ◉)
- **Favicon:** Ein weißer Dot auf schwarzem Grund
- **Loading-States:** Ein pulsierender Dot statt Spinner
- **Section-Trenner:** Drei Dots (· · ·) statt horizontaler Linien
- **Cursor / Hover:** Dot-Akzente bei interaktiven Elementen
- **Versionsnummer:** "v0.1 ●" — der Dot markiert die aktuelle Version
- **OG-Image:** Der Dot zentriert auf schwarzem Grund
- **Leer-Zustände:** "No proposals yet" mit einem einsamen Dot darunter

Das Ziel: Wer die Seite einmal gesehen hat, assoziiert den Dot mit dem Projekt. Er ist das Logo, das Icon und das erste Spielelement in einem.

---

### Micro-Copy im Narrator-Stil (Referenz für Claude Code)

Der Sloppy-Narrator-Stil zieht sich durch alle Texte der Seite — nicht nur Headlines, sondern auch Leer-Zustände, Fehlermeldungen, Tooltips und Platzhalter. Hier konkrete Beispiele die Claude Code als Tonalitäts-Referenz nutzen soll:

**Leer-Zustände:**
- Keine Proposals: "Nothing here yet. Be the first to tell the dot what to do."
- Keine Votes: "No votes. Tough crowd."
- Leerer Changelog: "v0.1 — A Dot. That's it. That's the changelog."

**Auth-Texte:**
- Login-Seite: "Welcome back. The dot missed you. (It didn't. It's a dot.)"
- Register-Seite: "Join the experiment. All we need is an email and a bad idea."
- Password Reset: "Forgot your password? Happens to the best of us."
- Nach Registrierung: "You're in. Now go tell the dot what to do."

**Proposal-Eingabe:**
- Placeholder im Textfeld: "The dot should..." 
- Zeichenzähler: "47/140 — keep it short, Shakespeare"
- Nach Submit: "Got it. Let's see if people agree."
- Rate Limit erreicht: "Easy there. 3 proposals per day. Quality over quantity."

**Voting:**
- Tooltip auf Dot-Counter: "Tap to vote. Every dot counts."
- Eigener Vote gesetzt: "You voted. The dot approves."

**Status-Änderungen:**
- Proposal accepted: "This one's happening."
- Proposal implemented: "Done. Check the changelog."
- Proposal rejected: "Not this time. The dot has spoken. (Just kidding, I did.)"

**Navigation:**
- "The Dot" (Home/Game) / "Proposals" / "The Evolution" (Changelog)

**404-Seite:**
- "This page doesn't exist. Much like this game's roadmap."

**Generelle Regel:** Wenn ein Text auf der Seite langweilig klingt, ist er falsch. Jeder String ist eine Gelegenheit für den Narrator-Voice.

---

## Datenmodell (Verhalten, nicht Schema)

> Schema wird von Claude Code auf Basis der Supabase-Codebase definiert.
> Hier nur das gewünschte Verhalten.

### Users
- Registrieren mit Email + Passwort (Supabase Auth)
- Wählen bei Registrierung einen einzigartigen Username
- Können Proposals erstellen und auf Proposals voten

### Proposals
- Haben einen einzelnen Text (max. 140 Zeichen), Ersteller, Erstelldatum
- Kein Titel/Beschreibung-Split — ein Feld, wie ein Tweet
- Status-Lifecycle: Open → Accepted → Implemented (oder Open → Rejected)
- Nur der Admin (Markus) kann den Status ändern
- Vote-Count ist die Summe der Upvotes

### Votes
- Ein User kann pro Proposal genau einmal voten (Upvote, togglebar)
- Kein Downvoting

### Versions
- Jede implementierte Änderung am Spiel = eine neue Version
- Version hat: Nummer, Titel, Beschreibung, Datum, Referenz zum Proposal
- Versions werden vom Admin erstellt

### Admin
- Der Admin (Markus) kann: Proposal-Status ändern, Versionen erstellen, Proposals löschen (Moderation)
- Kein Admin-Dashboard in V1 — Admin-Aktionen direkt in Supabase Dashboard oder über ein minimales Admin-Flag in der UI

---

## Der Game-Layer

### V1: Der Dot

Ein HTML5 Canvas Element, zentriert, das einen einzelnen weißen Punkt (Kreis, ~20px Radius) auf schwarzem Hintergrund rendert.

**Keine Interaktion.** Kein Movement. Kein Klick-Handler. Nur ein Punkt.

**Optional:** Ein subtiler, langsamer Pulsier-Effekt (Scale-Animation, ±2px, 3 Sekunden Zyklus). Der Punkt "lebt", auch wenn er noch nichts tut.

### Architektur-Prinzip

Der Game-Layer ist eine isolierte React-Komponente (`<GameCanvas />`) mit einem definierten Interface:
- `version: string` — aktuelle Versionsnummer
- Keine weiteren Props in V1

Die Komponente ist eine Black Box. Bei jeder neuen Version wird der Inhalt dieser Komponente geändert, aber die Plattform drumherum bleibt stabil. Das Game-Canvas ist bewusst NICHT als iFrame implementiert (unnötige Komplexität für V1), sondern als React-Komponente die den Canvas direkt rendert.

**Wenn das Spiel wächst:** Die Komponente kann zu einem dynamisch geladenen Modul werden, das pro Version austauschbar ist. Aber das ist Zukunftsmusik.

---

## Technische Anforderungen

### Boilerplate: Supabase Next.js Starter

Das Projekt baut auf dem **offiziellen Supabase Next.js Starter Template** auf:
```
npx create-next-app -e with-supabase
```

Dieses Template bringt mit:
- Next.js App Router mit TypeScript und Tailwind
- Supabase Auth komplett vorkonfiguriert (Cookie-basiert, SSR-kompatibel)
- Login, Signup, Password Reset Flows
- Server/Client Supabase Helper (`createClient` für beide Kontexte)
- Auth Middleware für geschützte Routen
- Auth Callback Route (`/auth/callback`)

**Was wir drauflegen:**
- 8bitcn/ui als UI-Layer (shadcn Registry, Pixel-Art-Komponenten)
- Username-Feld bei Registrierung (Supabase Auth speichert nur Email — Username kommt in eine eigene `profiles`-Tabelle)
- Game Canvas, Proposal-System, Voting, Changelog — alles custom
- Monochrom-Theme (überschreibt shadcn/8bitcn Defaults)

**Auth-Features die der Starter bereits abdeckt (NICHT selbst bauen):**
- Email/Password Registrierung + Login
- Password Reset ("Forgot Password" → Email → Reset-Link)
- Session Management (Cookie-basiert, Server Components kompatibel)
- Protected Routes via Middleware
- Auth State auf Client und Server

### Projektstruktur (Vorschlag — Claude Code entscheidet final)

```
startedwithadot/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root Layout, Fonts, Metadata
│   │   ├── page.tsx                # Landing: Dot + Proposals + Changelog
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts   # Supabase Auth Callback
│   │   ├── proposals/
│   │   │   └── page.tsx            # Alle Proposals (optional eigene Seite)
│   │   └── changelog/
│   │       └── page.tsx            # Version History
│   ├── components/
│   │   ├── ui/                     # 8bitcn/ui Komponenten (via CLI kopiert)
│   │   ├── GameCanvas.tsx          # Der Dot (isolierter Game-Layer)
│   │   ├── ProposalTimeline.tsx    # Proposal-Liste (Twitter-Style Feed)
│   │   ├── ProposalInput.tsx       # 140-Zeichen-Eingabe mit Dot-Submit
│   │   ├── DotCounter.tsx          # Vote-Anzeige als Dots (●●●● 12)
│   │   ├── VersionTimeline.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase Client
│   │   │   ├── server.ts           # Server Supabase Client
│   │   │   └── middleware.ts       # Auth Middleware
│   │   └── types.ts                # TypeScript Types
│   └── styles/
│       └── globals.css
├── supabase/
│   └── migrations/                 # DB Migrations
├── public/
│   └── (Favicon, OG-Image)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

### 8bitcn/ui Setup
- 8bitcn ist shadcn-basiert: Komponenten werden per CLI ins Projekt kopiert (`components/ui/`)
- Kein npm-Package als Dependency — der Code gehört dem Projekt
- Theme: Monochrom anpassen (8bitcn bringt Themes mit, aber wir brauchen ein reines Schwarz/Weiß/Grau-Theme)
- Relevante Komponenten: Button, Card, Input, Badge, Dialog/Modal, Tabs (für Proposal-Filter)
- 8bitcn setzt eine Pixel-Font voraus — Claude Code entscheidet welche und wie sie eingebunden wird (next/font oder lokal)
- Docs: https://www.8bitcn.com/docs

### Supabase Setup
- Neues Supabase-Projekt erstellen
- Auth mit Email/Password aktivieren
- Row Level Security (RLS) für alle Tabellen
- Policies: Jeder kann Proposals lesen, nur eingeloggte User können Proposals erstellen und voten, nur Admin kann Status ändern und Versionen erstellen

### Vercel Deployment
- Standard Next.js Deployment (kein Static Export — wir brauchen Server Components für Supabase)
- Environment Variables: Supabase URL + Anon Key + Service Role Key
- Domain: startedwithadot.com

### Performance
- Canvas-Rendering ist trivial (ein Kreis) — kein Performance-Concern
- Proposals werden mit Server Components geladen (SSR)
- Voting ist Client-seitig mit optimistic UI Updates
- Kein Realtime in V1 — Seite refreshen zeigt neue Votes (Realtime kommt in Phase 2)

### Responsive
- Mobile-first
- Canvas skaliert mit Viewport
- Proposal-Karten als Stack auf Mobile, Grid auf Desktop
- Auth-Forms zentriert, max-width begrenzt

### SEO & Social Sharing
- Gute Metadata + OG-Tags (Title, Description, OG-Image)
- OG-Image: Schwarzer Hintergrund, weißer Punkt, Text "It All Started With a Dot." — statisch generiert, kann Pixel-Art-Rahmen haben
- Favicon: Ein weißer Pixel-Dot auf schwarzem Grund (16x16 / 32x32)
- Description: "It's a dot. It does nothing. You decide what happens next."

---

## Was NICHT in V1 gehört (explizit Out of Scope)

- Kein Payment / Donation-System
- Keine Supporter-Tiers / Ultimate Version
- Keine spielbaren alten Versionen
- Kein Social Login (Google, Discord, GitHub)
- Kein Realtime-Voting (kommt in Phase 2)
- Kein Admin-Dashboard (Supabase Dashboard reicht)
- Kein öffentliches User-Profil
- Kein Kommentar-System auf Proposals
- Kein Downvoting
- Keine Kategorien/Tags für Proposals
- Kein Notification-System
- Keine API für externe Clients

---

## Zusammenfassung: Was gebaut werden soll

1. **Supabase Next.js Starter** als Fundament aufsetzen (`npx create-next-app -e with-supabase`)
2. **8bitcn/ui** als UI-Layer installieren, monochrom-Theme konfigurieren
3. **Supabase** erweitern: Profiles-Tabelle (Username), Proposals, Votes, Versions, RLS Policies
4. **Game-Layer:** Eine `<GameCanvas />`-Komponente die einen weißen Punkt auf schwarzem Canvas rendert
5. **Landing Page:** Hero mit Dot-Canvas, Proposal-Timeline, Changelog
6. **Auth erweitern:** Username-Feld bei Registrierung (Rest kommt vom Starter)
7. **Proposal-System:** Twitter-Style Timeline — 140 Zeichen, Dot-Counter für Votes, inline Submit
8. **Changelog:** Versionsliste mit Referenz zum jeweiligen Proposal
9. **Admin:** Proposal-Status ändern, Versionen erstellen (minimal, Flag-basiert)
10. **Styling:** 8bitcn/ui Pixel-Art-Komponenten, monochrom, Dark Theme — Dot als wiederkehrendes Element überall
11. **Vercel-Deployment** mit startedwithadot.com

---

## Roadmap nach V1 (nicht Teil dieses PRP)

- **Phase 2:** Realtime-Voting (Supabase Realtime), Social Login, Notification bei implementierten Vorschlägen
- **Phase 3:** Spielbare alte Versionen, Supporter-System (Stripe), "Impact Score" prominenter machen
- **Phase 4:** Community-Features (Kommentare auf Proposals, User-Profile, Achievement-System)
- **Phase 5:** Social Media Integration, Reddit-Bot für neue Versionen, Open-Source Game-Code

---

*"It all started with a dot. Where it ends is up to you."*
