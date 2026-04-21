# Spin's Sheets — Developer Guide

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Project Structure](#project-structure)
3. [Adding a New Game System](#adding-a-new-game-system)
4. [Adding NPC Templates](#adding-npc-templates)
5. [Adding Translations](#adding-translations)
6. [Component Reference](#component-reference)
7. [Backend Reference](#backend-reference)
8. [Deployment](#deployment)
9. [Common Patterns](#common-patterns)

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- Java 21+
- PostgreSQL
- Maven (included via `mvnw` wrapper)

### Frontend

```bash
cd vtm-frontend
npm install
npm run dev          # Starts Vite dev server at http://localhost:5173
```

### Backend

```bash
cd character-sheet
# Configure database in src/main/resources/application.properties
./mvnw spring-boot:run   # Starts Spring Boot at http://localhost:8080
```

### Database

The backend uses Hibernate `ddl-auto=update`, which automatically creates and modifies tables on startup. No manual migrations are needed — just point to a PostgreSQL database and start the app.

---

## Project Structure

```
/
├── vtm-frontend/           # React frontend
│   ├── src/
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # 60+ components (forms, shared UI)
│   │   ├── context/        # React contexts (Auth, Theme, NewChar)
│   │   ├── data/           # Game data catalogs (JSON-like JS exports)
│   │   ├── hooks/          # Custom hooks (useAutoCreate)
│   │   ├── i18n/           # Translations (EN + PT)
│   │   ├── pages/          # Page-level components
│   │   ├── index.css       # Import hub (19 @import statements)
│   │   ├── styles/         # Modular CSS (19 files)
│   │   │   ├── reset.css          # Box-sizing reset
│   │   │   ├── tokens.css         # CSS custom properties, all themes
│   │   │   ├── base.css           # html/body, accessibility helpers
│   │   │   ├── layout.css         # Header, nav, hamburger, footer
│   │   │   ├── typography.css     # Headings, paragraphs
│   │   │   ├── buttons.css        # All button variants
│   │   │   ├── forms.css          # Inputs, selects, fieldsets, tabs, ratings
│   │   │   ├── tags.css           # Tag system, info panel
│   │   │   ├── catalog.css        # Catalog search, items
│   │   │   ├── character-list.css # Character cards, list layout
│   │   │   ├── helpers.css        # Combobox, hints, role toggle
│   │   │   ├── badges.css         # Splat badge colors
│   │   │   ├── homepage.css       # Homepage, system cards, carousel
│   │   │   ├── view-mode.css      # Read-only form display
│   │   │   ├── splat-select.css   # Splat selection page
│   │   │   ├── responsive.css     # Media queries (1024px, 640px)
│   │   │   ├── components.css     # Health track, modals, blades dots
│   │   │   ├── dice-roller.css    # Dice roller styles
│   │   │   └── print.css          # Print styles, error boundary
│   │   └── main.jsx        # App entry
│   └── index.html          # SPA shell
│
├── character-sheet/        # Spring Boot backend
│   └── src/main/java/.../
│       ├── config/         # SecurityConfig, WebConfig, DataLoader, SpaForwardController
│       ├── controller/     # REST controllers
│       ├── entity/         # JPA entities (Character, AppUser, Chronicle, etc.)
│       ├── repository/     # Spring Data JPA repositories
│       ├── security/       # JWT, rate limiting, sanitization
│       └── service/        # Business logic services
│
├── docs/                   # Documentation
└── .github/workflows/      # CI/CD (deploy.yml)
```

---

## Adding a New Game System

This is the most common extension task. Follow these steps to add a complete new system (using Cyberpunk 2020 as the reference implementation):

### Step 1: Backend — Entity Fields

**File:** `character-sheet/src/main/java/.../entity/Character.java`

Add new fields with a system prefix (e.g., `cp*` for Cyberpunk):

```java
// ── New System ──
private String nsRole;          // Simple fields
private Integer nsStrength;     // Numeric stats

@Column(columnDefinition = "TEXT")
private String nsSkills;        // Complex data as JSON
```

**File:** `character-sheet/src/main/java/.../controller/CharacterController.java`

1. Add field copies in the `update()` method
2. Add splat values to `SPLAT_CATEGORY` map

**File:** `character-sheet/src/main/java/.../controller/ChronicleController.java`

Add to `SPLAT_CATEGORY` and `SYSTEM_FOR_CATEGORY` maps.

### Step 2: Backend — Routing

**File:** `SpaForwardController.java` — Add `/newsystem`, `/newsystem/**` to the `@RequestMapping` array

**File:** `SecurityConfig.java` — Add `/newsystem/**` to the `permitAll` matcher

### Step 3: Frontend — Data File

**File:** `vtm-frontend/src/data/newSystemData.js`

Export constants for roles, skills, equipment, etc.:

```js
export const NS_ROLES = [
  { value: 'Fighter', description: 'A combat specialist' },
  // ...
]
export const NS_ROLE_CATALOG = NS_ROLES.map(r => ({ value: r.value, description: r.description }))
```

### Step 4: Frontend — Character Form

**File:** `vtm-frontend/src/components/NewSystemForm.jsx`

Follow the pattern in `CyberpunkForm.jsx` or `UestrpgForm.jsx`:

```jsx
const TAB_KEYS = ['tabNsIdentity', 'tabNsStats', ...]
const INITIAL = { splat: 'NEW_SYSTEM', name: '', ... }

export default function NewSystemForm() {
  const [tab, setTab] = useState(0)
  const [fields, setFields] = useState(INITIAL)
  const [showExport, setShowExport] = useState(false)
  // ... standard hooks, load/save functions

  return (
    <div>
      {/* Tab list with ARIA */}
      <div className="tab-list" role="tablist">
        {TAB_KEYS.map((tk, i) => (
          <button key={tk} id={`tab-${i}`} role="tab"
            aria-selected={tab === i} aria-controls={`tabpanel-${i}`}
            onClick={() => setTab(i)}>{t(tk)}</button>
        ))}
      </div>

      {/* Tab panels with ARIA */}
      <div hidden={tab !== 0} role="tabpanel" id="tabpanel-0" aria-labelledby="tab-0">
        {/* Content */}
      </div>

      {/* Export modal */}
      <ExportModal open={showExport} onClose={() => setShowExport(false)}
        tabKeys={TAB_KEYS} t={t} />
    </div>
  )
}
```

### Step 5: Frontend — Antagonist Form + NPC Data

**File:** `vtm-frontend/src/data/newSystemNpcs.js` — Premade NPC templates
**File:** `vtm-frontend/src/components/NewSystemAntagonistForm.jsx` — Simplified NPC form with template loader

### Step 6: Frontend — System Page

**File:** `vtm-frontend/src/pages/NewSystemPage.jsx`

Filter characters by splat, show chronicles, new character/antagonist buttons.

### Step 7: Frontend — Wiring

**File:** `App.jsx`
- Add lazy imports for form, antagonist form, page
- Add to `THEME_TO_CHARACTERS_PATH`
- Add routes

**File:** `CharacterRouter.jsx`
- Add lazy imports
- Add splat routing
- Add theme switching

**File:** `CharacterList.jsx`
- Add to `SPLAT_LABEL_KEYS`
- Add to `NON_WOD` filter set

**File:** `splatCategories.js`
- Add splat-to-category mapping

**File:** `XpLogSection.jsx`
- Add system-specific XP cost configuration

### Step 8: Frontend — Styling

**File:** `styles/tokens.css`

Add theme tokens:
```css
[data-theme="newsystem"] {
  --color-border-focus:   #yourcolor;
  --color-accent:         #yourcolor;
  --color-accent-fg:      #yourcolor;
  --color-accent-hover:   #yourcolor;
}
```

Add system card styles to `styles/homepage.css` and splat badge colors to `styles/badges.css`. Any new component styles should go in the appropriate module file under `styles/`.

### Step 9: Frontend — Translations

**File:** `translations.js`

Add ~40-80 keys for both EN and PT: system name/description, tab labels, field labels, UI strings.

### Step 10: Homepage

**File:** `HomePage.jsx`
- Add system card
- Add to "Supported Games" section

### Step 11: Chronicle & Character Pages

**File:** `AllChroniclesPage.jsx` — Add to `SYSTEMS` array
**File:** `AllCharactersPage.jsx` — Add to `SYSTEMS` array with splat set
**File:** `NewCharacterModal.jsx` — Add to `GAME_SYSTEMS` array

---

## Adding NPC Templates

NPC templates are stored in data files under `vtm-frontend/src/data/`.

### Structure

```js
export const SYSTEM_PREMADE_NPCS = [
  {
    name: 'Guard Captain',
    description: 'Seasoned officer leading a squad',
    // System-specific stats...
    notes: 'Tactics: Defensive formation, calls for backup...',
  },
]

export const SYSTEM_NPC_CATALOG = SYSTEM_PREMADE_NPCS.map(n => ({
  value: n.name,
  description: n.description,
}))
```

### Loading Templates

In the antagonist form:
```jsx
import { SYSTEM_PREMADE_NPCS, SYSTEM_NPC_CATALOG } from '../data/systemNpcs'

function loadTemplate(name) {
  const tmpl = SYSTEM_PREMADE_NPCS.find(t => t.name === name)
  if (!tmpl) return
  setFields(prev => ({ ...prev, ...mapTemplateToFields(tmpl) }))
}

<CatalogSelect catalog={SYSTEM_NPC_CATALOG}
  onChange={(_, v) => loadTemplate(v)} />
```

---

## Adding Translations

All translations live in `vtm-frontend/src/i18n/translations.js`.

### Structure

The file exports an object with two top-level keys:
```js
const translations = {
  en: { key: 'English text', ... },
  pt: { key: 'Portuguese text', ... },
}
```

### Conventions

- System-specific keys are prefixed: `cp*` (Cyberpunk), `blades*` (Blades), `dnd*` (D&D)
- Tab keys: `tabCpIdentity`, `tabCpStats`, etc.
- Always add both EN and PT entries
- Game-mechanical terms (Discipline names, Gift names) stay in English — they are proper nouns
- UI labels, hints, placeholders, and legends must be translated

### Finding Where to Insert

Search for existing keys near your system's section:
```bash
grep -n 'cpRole:' src/i18n/translations.js  # Find Cyberpunk section
```

---

## Component Reference

### CatalogSelect

Searchable dropdown with descriptions and keyboard navigation.

```jsx
<CatalogSelect
  id="unique-id"
  name="fieldName"
  label="Label Text"
  value={currentValue}
  onChange={handleField}           // (name, value) => void
  catalog={[{ value: 'Option', description: 'Desc' }]}
  placeholder="Search..."
  showDescOnSelect={true}         // Show description after selection
  directOnChange={false}          // If true, onChange receives just the value
/>
```

### DotRating

Numeric rating component (1-10 scale, rendered as select dropdown).

```jsx
<DotRating
  label="Strength"
  name="strength"
  value={fields.strength}
  onChange={handleField}           // (name, value) => void
  min={0}
  max={10}
/>
```

### XpLogSection

Experience tracking with per-system cost calculations.

```jsx
<XpLogSection
  splat="cyberpunk"               // System identifier
  xpLog={xpLog}                   // Array of log entries
  onAdd={async (entry) => {...}}  // Add entry callback
  onRemove={async (id) => {...}}  // Remove entry callback
  onError={(msg) => {...}}        // Error callback
  t={t}                           // Translation function
/>
```

### ExportModal

PDF export with per-section toggles.

```jsx
<ExportModal
  open={showExport}
  onClose={() => setShowExport(false)}
  tabKeys={TAB_KEYS}              // Array of tab key strings
  t={t}                           // Translation function
/>
```

---

## Backend Reference

### Adding Fields to Character Entity

1. Add the field to `Character.java`
2. Add the field copy to `CharacterController.update()`
3. Hibernate auto-DDL creates the column on next restart
4. No migration scripts needed

### Access Control

- `CharacterAccessChecker.getCurrentUser()` — Returns the authenticated `AppUser`
- `CharacterAccessChecker` grants Storytellers access to all characters
- Players can only access characters where `owner.id == user.id`

### Chronicle Segregation

Chronicles are segregated by game system via:
- `SPLAT_CATEGORY` map — Maps splat values to system categories
- `SYSTEM_FOR_CATEGORY` map — Maps categories to game systems
- `isSplatAllowed()` — Checks if a character's splat is allowed in a chronicle

---

## Deployment

### Automatic (CI/CD)

Push to `main` triggers the GitHub Actions workflow:

```
Push → Build frontend → Copy to static → Build JAR → SCP to EC2 → Restart service
```

### Manual

```bash
# Frontend
cd vtm-frontend && npm run build

# Copy to Spring Boot
cp -r dist/* ../character-sheet/src/main/resources/static/

# Backend
cd ../character-sheet && ./mvnw package -DskipTests

# Deploy
scp target/*.jar user@server:/opt/spinsheets/app.jar
ssh user@server 'sudo systemctl restart spinsheets'
```

---

## Common Patterns

### JSON Field Storage

For variable-length data (skills, equipment, etc.):

```jsx
// Parse
const skills = (() => { try { return JSON.parse(fields.cpSkills) || [] } catch { return [] } })()

// Update
function setSkills(next) {
  handleField('cpSkills', JSON.stringify(next))
}
```

### Tab System (ARIA-compliant)

```jsx
// Tab buttons
<button id={`tab-${i}`} role="tab" aria-selected={tab === i}
  aria-controls={`tabpanel-${i}`} onClick={() => setTab(i)}>

// Tab panels
<div hidden={tab !== i} role="tabpanel" id={`tabpanel-${i}`}
  aria-labelledby={`tab-${i}`}>
```

### Theme Switching

```jsx
const { switchTheme } = useTheme()
useEffect(() => { switchTheme('cyberpunk') }, [])
```

### Auto-Create Hook

Handles `?npc=true` and `?chronicle=X` query params:

```jsx
const { isAutoCreating } = useAutoCreate(characterId, INITIAL)
if (isAutoCreating) return <p>Loading...</p>
```

### Form Save Pattern

```jsx
async function handleSave() {
  setSaving(true); setSaveError(null)
  try { await updateCharacter(characterId, fields) }
  catch { setSaveError(t('failedToSave')) }
  finally { setSaving(false) }
}

async function handleDoneEditing() {
  await handleSave()
  navigate('/system-page')
}
```
