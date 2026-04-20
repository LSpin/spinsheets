# Spin's Sheets — Design Document

## Overview

Spin's Sheets is a web-based tabletop RPG character sheet manager supporting 8 game systems with 33 character forms, 350+ NPC templates, chronicle management, and built-in dice rollers. The application is fully bilingual (English / Portuguese) and designed for both desktop and mobile use.

**Live URL:** https://spinsheets.com

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19 |
| Build | Vite | Latest |
| Routing | React Router | v7 |
| Backend | Spring Boot | 3.5 |
| Language | Java | 21 |
| Database | PostgreSQL | Latest |
| Auth | JWT + BCrypt | Custom |
| Hosting | AWS EC2 | Ubuntu |
| Reverse Proxy | Caddy | Latest |
| CI/CD | GitHub Actions | Push to main |
| TLS | Caddy auto-HTTPS | Let's Encrypt |

---

## Architecture

```
Browser
  │
  ├── React SPA (Vite build → /assets/*.js)
  │     ├── React Router v7 (client-side routing)
  │     ├── 78 lazy-loaded chunks (code splitting)
  │     ├── AuthContext (JWT in localStorage)
  │     ├── ThemeContext (CSS custom properties)
  │     └── LanguageContext (EN/PT translations)
  │
  ├── API calls → /api/*
  │
  └── Caddy reverse proxy → localhost:8080
        │
        Spring Boot 3.5
          ├── SecurityConfig (JWT filter, CORS, permitAll rules)
          ├── SpaForwardController (HTML routes → index.html)
          ├── CharacterController (CRUD for all game systems)
          ├── ChronicleController (chronicle management)
          ├── AuthController (register, login, forgot-password)
          ├── MeritController / FlawController (catalog endpoints)
          └── PostgreSQL (Hibernate auto-DDL)
```

### Key Design Decisions

1. **Single Character Entity** — One `Character` table with ~250 nullable columns covers all 8 game systems. Each system uses a subset of fields prefixed by system (`dnd*`, `cp*`, `blades*`, etc.) plus shared fields (`name`, `concept`, `backstory`, `notes`). This avoids complex joins and keeps CRUD simple.

2. **Splat Enum** — The `splat` field (e.g., `VAMPIRE`, `BLADES`, `DND`, `CYBERPUNK`) determines which form component renders and which fields are relevant. Splat also drives chronicle segregation (`SPLAT_TO_CATEGORY` map).

3. **Lazy Loading** — Every form component is lazy-loaded via `React.lazy` with a `lazyRetry` wrapper that handles stale chunk hashes after deploys (one-time auto-reload via sessionStorage flag).

4. **JSON Text Fields** — Complex variable-length data (skills, cyberware, weapons, gear, vehicles, lifepath) is stored as JSON strings in TEXT columns rather than separate entity tables. The frontend parses/serializes JSON; the backend treats them as opaque strings.

5. **Theme System** — CSS custom properties (`--color-accent`, `--color-accent-fg`, etc.) switch per game system via `data-theme` attribute on the root element. Eight themes: wod (red), 7thsea (gold), l5r (emerald), blades (crimson), dnd (warm red), uestrpg (steel blue), cyberpunk (neon cyan).

---

## Data Model

### Core Entities

| Entity | Table | Purpose |
|--------|-------|---------|
| `Character` | `characters` | All character data for all systems (~250 columns) |
| `AppUser` | `app_users` | User accounts (username, email, password hash, role) |
| `Chronicle` | `chronicles` | Game campaigns (name, description, game system, storyteller) |
| `Merit` | `merits` | WoD merit catalog (seeded from JSON on first boot) |
| `Flaw` | `flaws` | WoD flaw catalog (seeded from JSON on first boot) |
| `CharacterMerit` | `character_merits` | Join table: character ↔ merit |
| `CharacterFlaw` | `character_flaws` | Join table: character ↔ flaw |
| `Discipline` | `disciplines` | WoD discipline/power sub-entities per character |
| `XpLogEntry` | `xp_log_entries` | Experience point log entries per character |
| `ChronicleSession` | `chronicle_sessions` | Session notes per chronicle |

### Character Field Groups

| Prefix | System | Example Fields |
|--------|--------|---------------|
| (none) | Shared | `name`, `concept`, `splat`, `npc`, `backstory`, `notes` |
| (none) | WoD | `strength`..`wits`, `willpower`, `clan`, `generation`, `pathName` |
| `blades*` | Blades | `bladesPlaybook`, `bladesStress`, `bladesTrauma`, `bladesHunt`..`bladesSway` |
| `dnd*` | D&D/UESTRPG | `dndStrength`..`dndCharisma`, `dndLevel`, `dndHpMax`, `dndSpells` |
| `uestrpg*` | UESTRPG | `uestrpgBirthsign`, `uestrpgMagickaMax`, `uestrpgLuck` |
| `cp*` | Cyberpunk | `cpRole`, `cpHandle`, `cpInt`..`cpEmp`, `cpSkills` (JSON), `cpCyberware` (JSON) |

### Authentication

- JWT tokens stored in `localStorage` as `vtm_token`
- BCrypt password hashing
- Two roles: `PLAYER` and `STORYTELLER`
- Storytellers can view all characters, manage chronicles, create NPCs
- Players can only view/edit their own characters
- Password reset via email (forgot-password flow)

---

## Game Systems

| System | Splat Values | Theme | Forms | NPC Templates |
|--------|-------------|-------|-------|---------------|
| World of Darkness | VAMPIRE, WEREWOLF, MAGE, HUNTER, WRAITH, CHANGELING, DEMON, BSD, MORTAL, + variants | wod (red) | 20 | 122 |
| 7th Sea 2e | SEVENTH_SEA | 7thsea (gold) | 2 | 35 |
| L5R 4e | L5R, L5R_ANTAGONIST | l5r (emerald) | 2 | 37 |
| Blades in the Dark | BLADES, BLADES_CREW, BLADES_ANTAGONIST | blades (crimson) | 3 | 23 |
| D&D 5e | DND, DND_MONSTER | dnd (warm red) | 2 | 120 |
| UESTRPG | UESTRPG, UESTRPG_ANTAGONIST | uestrpg (steel blue) | 2 | 34 |
| Cyberpunk 2020 | CYBERPUNK, CYBERPUNK_ANTAGONIST | cyberpunk (neon cyan) | 2 | 25 |

### WoD Sub-Systems

The World of Darkness umbrella covers 20 forms across multiple game lines:

- **Vampire:** V20, Revised, Dark Ages, Victorian Age, Kindred of the East
- **Werewolf:** W20, Wyld West, Changing Breeds, Kinfolk, Totems, Black Spiral Dancers
- **Mage:** M20, Victorian Mage, Familiars
- **Others:** Hunter: The Reckoning, Wraith: The Oblivion, Changeling: The Dreaming, Demon: The Fallen, Mortals

---

## Frontend Architecture

### Directory Structure

```
vtm-frontend/src/
├── api/                    # Axios API clients
│   ├── characterApi.js     # Character CRUD, merits, flaws, XP log
│   └── chronicleApi.js     # Chronicle CRUD, sessions, invites
├── components/             # 60+ components
│   ├── CharacterForm.jsx   # V20 Vampire (reference pattern)
│   ├── WerewolfForm.jsx    # Werewolf: The Apocalypse
│   ├── MageForm.jsx        # Mage: The Ascension
│   ├── ...                 # 30 more form components
│   ├── CatalogSelect.jsx   # Searchable dropdown with descriptions
│   ├── DotRating.jsx       # 1-10 rating component
│   ├── XpLogSection.jsx    # Experience tracking (all systems)
│   ├── RulesReferenceTab.jsx # Static rules reference
│   ├── ExportModal.jsx     # PDF export with section toggles
│   ├── NewCharacterModal.jsx # Unified character creation flow
│   └── MeritsFlawsSection.jsx # WoD merits/flaws management
├── context/                # React contexts
│   ├── AuthContext.jsx      # JWT auth state
│   ├── ThemeContext.jsx     # Theme switching
│   └── NewCharContext.jsx   # Global new character modal
├── data/                   # Game data catalogs
│   ├── cyberpunkData.js    # CP2020: roles, skills, cyberware, weapons, vehicles
│   ├── cyberpunkNpcs.js    # CP2020: 25 NPC templates
│   ├── dnd5eSpells.js      # D&D: 233 spells
│   ├── dnd5eMonsters.js    # D&D: 120 monster templates
│   ├── dnd5eFeats.js       # D&D: 42 SRD feats
│   ├── mageRotes.js        # Mage: 168 rotes
│   ├── werewolfGifts.js    # Werewolf: gifts catalog
│   ├── wodNpcs.js          # WoD: 122 NPC templates
│   └── ...                 # 20+ more data files
├── hooks/
│   └── useAutoCreate.js    # Auto-create character from URL params
├── i18n/
│   ├── LanguageContext.jsx  # Language switching
│   └── translations.js     # ~800 EN + PT translation keys
├── pages/                  # Page-level components
│   ├── HomePage.jsx         # Landing page with tutorial
│   ├── AllCharactersPage.jsx # Unified character browser
│   ├── AllChroniclesPage.jsx # Unified chronicle browser
│   └── ...                  # System-specific pages
├── index.css               # All styles (~3000 lines)
└── main.jsx                # App entry point
```

### Component Patterns

Every character form follows the same pattern (see `CharacterForm.jsx` as reference):

```jsx
// 1. Imports
import { useState, useEffect } from 'react'
import DotRating from './DotRating'
import CatalogSelect from './CatalogSelect'
import XpLogSection from './XpLogSection'
import ExportModal from './ExportModal'

// 2. Constants
const TAB_KEYS = ['tabIdentity', 'tabAttributes', ...]
const INITIAL = { splat: 'VAMPIRE', name: '', ... }

// 3. Component
export default function CharacterForm() {
  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [showExport, setShowExport] = useState(false)

  // Load character on mount
  useEffect(() => { if (characterId) loadCharacter() }, [characterId])

  // Tab buttons with ARIA
  <div className="tab-list" role="tablist">
    {TAB_KEYS.map((tk, i) => (
      <button key={tk} id={`tab-${i}`} role="tab"
        aria-selected={tab === i} aria-controls={`tabpanel-${i}`}>
        {t(tk)}
      </button>
    ))}
  </div>

  // Tab panels with ARIA
  <div hidden={tab !== 0} role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0">
    ...
  </div>

  // Export modal
  <ExportModal open={showExport} onClose={() => setShowExport(false)}
    tabKeys={TAB_KEYS} t={t} />
}
```

### Mobile UX

#### Hamburger Navigation Menu

- **Breakpoint:** Appears at `max-width: 640px` — below this width the full navigation bar collapses into a hamburger icon
- **Animation:** Three-line icon animates to an X when open (CSS transforms on the spans)
- **Dismissal:** Closes on Escape key press, click/tap outside the menu, or on navigation (route change)
- **Accessibility:** Uses `aria-expanded` on the toggle button, `aria-label="Menu"`, focus trapped while open

#### System Selector Carousel

- On desktop, the homepage shows a responsive grid of system cards (7 systems)
- On mobile (< 640px), the grid is replaced by a single-card carousel with prev/next arrow buttons and dot indicators
- One system is visible at a time; arrows navigate between them
- Dot indicators below allow direct jump to any system
- Accessibility: `role="region"` with `aria-roledescription="carousel"`, `aria-live="polite"` on the track for screen reader announcements, dynamic `aria-label` on arrows showing destination system name, dots use `role="tab"` with `aria-selected`

#### Collapsible Tab Dropdown

- On mobile viewports, the form tab bar collapses to show only the currently active tab name with a `▼` arrow indicator
- Tapping the active tab expands the full list of tabs as a dropdown overlay
- Selecting a tab from the list navigates to that tab and collapses the dropdown
- Clicking/tapping outside the dropdown dismisses it without changing tabs
- The dropdown uses the same `role="tablist"` semantics as the desktop tab bar

#### Tab Carousel

- **Prev/Next Arrows:** Arrow buttons flank the collapsed tab dropdown on mobile, allowing sequential tab navigation without opening the dropdown
- **Dynamic ARIA Labels:** Each arrow shows the destination tab name — e.g., `aria-label="Previous: Stats"`, `aria-label="Next: Combat"` — so screen readers announce where the user is heading
- **Disabled State:** The previous arrow is disabled on the first tab; the next arrow is disabled on the last tab. Disabled arrows are visually dimmed and excluded from the tab order
- **Group Wrapper:** The carousel (prev arrow + dropdown + next arrow) is wrapped in `role="group"` with `aria-label="Tab navigation"` for screen reader context
- **Auto-Updates:** Arrow labels update dynamically on every tab change to always reflect the correct neighboring tabs

#### Sticky Bottom Action Bar

- On mobile viewports, the form action buttons (Save, Export PDF, Cancel) stick to the bottom of the screen via `position: sticky`
- A subtle shadow separator distinguishes the action bar from scrollable content above
- Buttons remain always visible and thumb-reachable regardless of scroll position
- The bar collapses into the normal document flow on desktop where it is not needed

#### PWA Support

- **manifest.json** configured with `"display": "standalone"` for native-app-like experience when installed
- **Service Worker** caches hashed assets (JS, CSS, images) using a cache-first strategy for instant loads, and caches HTML using network-first with an offline fallback page
- **Apple Meta Tags** (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`) enable full-screen home screen install on iOS Safari
- The app can be installed via "Add to Home Screen" on both iOS and Android

#### Language Toggle

- The language toggle button is always visible in the header, outside the hamburger menu, so users can switch languages regardless of navigation state

### Shared Components

| Component | Purpose |
|-----------|---------|
| `DotRating` | 0-10 dot/select rating (WoD attributes, skills) |
| `CatalogSelect` | Searchable dropdown with descriptions and arrow-key navigation |
| `XpLogSection` | Per-system XP/IP tracking with cost calculations |
| `RulesReferenceTab` | Collapsible rules reference sections |
| `ExportModal` | PDF export with per-section toggles |
| `MeritsFlawsSection` | WoD merits/flaws with catalog search |
| `TagInfoPanel` | Sticky sidebar showing selected item details |
| `BladesDiceRoller` | d6 pool roller for Blades |
| `StorytellerDiceRoller` | d10 pool roller for WoD |
| `DndDiceRoller` | d20 roller for D&D/UESTRPG |

---

## Backend Architecture

### Controllers

| Controller | Endpoints | Purpose |
|-----------|-----------|---------|
| `AuthController` | `/api/auth/*` | Register, login, password reset |
| `CharacterController` | `/api/characters/*` | Character CRUD, access control |
| `ChronicleController` | `/api/chronicles/*` | Chronicle CRUD, sessions, invites |
| `MeritController` | `/api/merits` | Merit catalog (public) |
| `FlawController` | `/api/flaws` | Flaw catalog (public) |
| `CharacterMeritController` | `/api/characters/:id/merits` | Character merit management |

### Security

- `JwtAuthenticationFilter` — Extracts and validates JWT from Authorization header
- `RateLimitFilter` — Rate limiting on auth endpoints
- `SanitizationFilter` — XSS prevention on request bodies
- `CharacterAccessChecker` — Ensures users can only access their own characters (STs can access all)
- `SecurityConfig` — Permit public routes (static assets, auth, merits/flaws), authenticate everything else

### Data Seeding

`DataLoader` runs on startup:
1. If merits table is empty, loads from `vampiro_merits_flaws_en.json` (338 merits, 197 flaws)
2. Always applies `merits_flaws_patch.json` (adds missing entries by name)
3. One-time migration: fixes TBD merit names and Portuguese flaw names

---

## Deployment

### CI/CD Pipeline (`.github/workflows/deploy.yml`)

```
Push to main
  → Build frontend (npm ci && npm run build)
  → Copy dist/* to Spring Boot static/
  → Build JAR (mvn package -DskipTests)
  → SCP JAR to EC2
  → SSH: restart spinsheets service, reload Caddy
```

### Server Setup

- EC2 instance running Ubuntu
- Caddy as reverse proxy (auto-HTTPS via Let's Encrypt)
- `spinsheets` systemd service running the Spring Boot JAR
- PostgreSQL database (local or managed)

### Caching Strategy

- **`WebConfig` filter** (Spring Boot `OncePerRequestFilter`) sets HTTP cache headers based on request path:
  - `/assets/**` → `Cache-Control: public, max-age=31536000, immutable` (hashed filenames change on every build, so these are safe to cache indefinitely)
  - All other routes (HTML) → `Cache-Control: no-cache, no-store, must-revalidate` (ensures the browser always fetches a fresh `index.html` after deploys)
- This two-tier approach guarantees users always get the latest app shell while benefiting from permanent caching for versioned assets
- `lazyRetry` wrapper handles stale chunks after deploy (auto-reload once via sessionStorage flag)

---

## Accessibility

### WCAG 2.1 AA Compliance (~95%)

- **Semantic HTML** — All forms use `<fieldset>`, `<legend>`, `<label>`, proper heading hierarchy
- **ARIA tabs** — All 33 forms have `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-labelledby`, `aria-controls`
- **Keyboard navigation** — All interactive elements reachable via Tab, custom controls support Enter/Space
- **Focus management** — Modals have `autoFocus`, `aria-modal`, Escape to close, click-outside dismiss
- **Live regions** — `aria-live="polite"` on dynamic content, `role="alert"` on errors
- **Color** — All information conveyed with text, not color alone. Contrast ratios checked per theme
- **Mobile** — Hamburger menu with `aria-expanded`, animated icon, Escape/click-outside/navigation dismiss; collapsible tab dropdown shows active tab with `▼` indicator, expands full list on tap, dismisses on click-outside; touch targets meet 44px minimum
- **Print** — `@media print` stylesheet shows all tabs, hides nav/buttons, clean black-on-white

---

## Internationalization

- Two languages: English (default) and Portuguese
- ~800 translation keys in `translations.js`
- `useLanguage()` hook provides `t(key)` function and `lang`/`toggle`
- Language toggle always visible in header
- Game-mechanical terms (Discipline names, Gift names, etc.) remain in English as they are proper nouns

---

## Feature Summary

### For Everyone
- **PWA installable** — Add to Home Screen on iOS or Android for a native-app experience with offline support and instant load times

### For Players
- Create characters across 8 game systems
- Searchable catalogs for powers, equipment, spells, cyberware
- Built-in dice rollers matching each system's mechanics
- XP/IP tracking with proper cost calculations
- Export PDF with selectable sections
- Join chronicles via invite link
- Search, sort, and filter characters

### For Storytellers
- All player features plus:
- NPC generators with 350+ premade templates
- Chronicle management (create, invite, manage sessions)
- View and manage players' character sheets
- Clock mechanics (Blades in the Dark)
- Antagonist forms for every system
- Player management page
