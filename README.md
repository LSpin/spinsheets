# Spin's Sheets

**Tabletop RPG character sheet manager for 9 game systems.**

Live at [spinsheets.com](https://spinsheets.com)

---

## What Is This?

A web app for creating, managing, and sharing tabletop RPG character sheets. Built for players and storytellers who want searchable catalogs, built-in dice rollers, and chronicle management — without flipping through sourcebooks.

### Supported Systems

| System | Sheets | NPC Templates |
|--------|--------|---------------|
| World of Darkness (V20, W20, M20) | 20 | 122 |
| 7th Sea 2nd Edition | 3 | 74 |
| Legend of the Five Rings 4e + 5e | 3 | 37 |
| Blades in the Dark + Deep Cuts | 3 | 23 |
| D&D 5th Edition (SRD) | 2 | 120 |
| UESTRPG (Elder Scrolls) | 2 | 34 |
| Cyberpunk 2020 | 2 | 25 |
| ASOIAF RPG | 2 | 27 |
| **Total** | **37** | **462** |

### Features

- **37 character sheets** — each tailored to its system's mechanics
- **Auto-calculations** — clan curse warnings, blood pool alerts, form stat modifiers, race ASI auto-apply, insight rank detection, 7th Sea background auto-apply with guided mode budgets, exhaustion tracking (D&D), resonance/rote filtering (Mage), renown rank thresholds (Werewolf), humanity counter with IP cost calculator (Cyberpunk), and more across all sheets
- **Searchable catalogs** — Disciplines, Gifts, Spells, Cyberware, Feats, Equipment with descriptions and source book filters
- **Dice rollers** — d10 pools, d6 pools, d20, roll-and-keep, d10 with fumble/critical
- **Chronicle management** — create campaigns, invite players, track sessions
- **460+ NPC templates** — premade antagonists loadable in one selection
- **XP tracking** — per-system cost calculations and advancement logs
- **Export PDF** — print any sheet with selectable sections
- **ST Tools** — Storyteller-only hub pages for all 7 main systems (Blades, WoD, Cyberpunk, D&D, 7th Sea, L5R, ASOIAF), with random generators for encounters, NPCs, factions, downtime, and more. 37 tabs total across all systems, fully bilingual EN + PT. Accessible from a central `/st-tools` landing page showing all 7 systems as cards, with a "ST Tools" nav menu link (Storytellers only)
- **Bilingual** — English and Portuguese (800+ translation keys)
- **Accessible** — WCAG 2.1 AA compliant (~95%), screen reader support, keyboard navigation, aria-live regions on all dynamic warnings
- **Mobile-friendly** — hamburger nav (left-aligned) with fixed dropdown clipping, collapsible tab carousel, sticky save bar, PWA installable
- **Blades crew sheet** — Faction Tracker (26 Doskvol factions, -3 to +3 scale), Turf Tracker (claimable territories), Vault capacity auto-scales with upgrades, long-term project clocks with SVG pie segments, Devil's Bargain reminder

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7 |
| Backend | Spring Boot 3.5, Java 21 |
| Database | PostgreSQL |
| Auth | JWT + BCrypt |
| Hosting | AWS EC2, Caddy (auto-HTTPS) |
| CI/CD | GitHub Actions (push to main → build → deploy) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Java 21+
- PostgreSQL

### Frontend

```bash
cd vtm-frontend
npm install
npm run dev
```

Runs at http://localhost:5173

### Backend

Create a PostgreSQL database, then:

```bash
cd character-sheet
```

Set environment variables:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/vtm_db
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_db_password
export JWT_SECRET=your-secret-key-at-least-256-bits
```

Then run:

```bash
./mvnw spring-boot:run
```

Runs at http://localhost:8080. Hibernate auto-creates tables on first start.

---

## Project Structure

```
vtm-frontend/src/
├── api/            # Axios API clients
├── components/     # 60+ components (33 character forms + shared UI)
├── context/        # Auth, Theme, NewChar contexts
├── data/           # Game catalogs (skills, spells, cyberware, NPCs, sevenSeaData.js — 13 supplements)
├── hooks/          # useAutoCreate
├── i18n/           # EN + PT translations
├── pages/          # Page-level components
├── index.css       # Import hub (19 @import statements)
└── styles/         # Modular CSS (19 files)

character-sheet/src/main/java/.../
├── config/         # Security, caching, SPA forwarding, data seeding
├── controller/     # REST endpoints
├── entity/         # JPA entities (Character, Chronicle, AppUser, etc.)
├── repository/     # Spring Data repositories
├── security/       # JWT filter, rate limiting, sanitization
└── service/        # Business logic
```

---

## Documentation

Full docs in the [`/docs`](docs/) folder:

| Document | EN | PT |
|----------|----|----|
| Design Document | [DESIGN.md](docs/DESIGN.md) | [DESIGN_PT.md](docs/DESIGN_PT.md) |
| User Guide | [USER_GUIDE.md](docs/USER_GUIDE.md) | [USER_GUIDE_PT.md](docs/USER_GUIDE_PT.md) |
| Developer Guide | [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | [DEVELOPER_GUIDE_PT.md](docs/DEVELOPER_GUIDE_PT.md) |
| UX Writing Style Guide | [UX_WRITING.md](docs/UX_WRITING.md) | [UX_WRITING_PT.md](docs/UX_WRITING_PT.md) |

---

## Adding a New Game System

The [Developer Guide](docs/DEVELOPER_GUIDE.md) has an 11-step walkthrough. In short:

1. Add fields to `Character.java`
2. Add field copies to `CharacterController.java`
3. Add routes to `SpaForwardController` + `SecurityConfig`
4. Create data file (`src/data/newSystemData.js`)
5. Create character form (`src/components/NewSystemForm.jsx`)
6. Create antagonist form + NPC templates
7. Create system page
8. Wire up `App.jsx`, `CharacterRouter.jsx`, `splatCategories.js`
9. Add theme to `styles/tokens.css`
10. Add translations (EN + PT)
11. Add to homepage

---

## World of Darkness Coverage

The WoD umbrella includes 20 forms:

**Vampire** — V20, Revised, Dark Ages, Victorian Age, Kindred of the East, Ghouls

**Werewolf** — W20, Wyld West, Changing Breeds, Kinfolk, Totems, Black Spiral Dancers

**Mage** — M20, Victorian Mage, Familiars

**Others** — Hunter: The Reckoning, Wraith: The Oblivion, Changeling: The Dreaming, Demon: The Fallen, Mortals

Each with structured catalogs (Disciplines, Gifts, Rotes, Arcanoi, Edges, Lores, Arts), merits/flaws from the database (338 merits, 197 flaws), and system-specific dice rollers.

---

## Accessibility

- ARIA tab interfaces on all 33 forms (`role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-labelledby`)
- Hamburger nav with `aria-expanded`, Escape key, click-outside dismiss
- Tab carousel with dynamic `aria-label` showing destination tab name
- Live regions (`aria-live="polite"`) for all dynamic content including auto-calculation warnings
- `role="alert"` on all error messages and threshold warnings
- Minimum 4.5:1 contrast ratios across all 8 themes
- 44px minimum touch targets on mobile
- No color-only information — all paired with text
- Full keyboard navigation
- Print stylesheet for clean export

See the [UX Writing Style Guide](docs/UX_WRITING.md) for accessibility-first writing conventions.

---

## License

This is a fan project. All game systems, settings, and related content are the property of their respective publishers. All rights reserved.

---

Built by [LSpin](https://github.com/LSpin)
