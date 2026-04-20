# Spin's Sheets — UX Writing Style Guide

## Voice & Tone

### Overall Voice
- **Direct and helpful** — Guide users clearly without being patronizing
- **Casual but professional** — Friendly tabletop RPG community tone, not corporate
- **Action-oriented** — Tell users what they can do, not what the system does
- **Inclusive** — Avoid assumptions about ability, device, or experience level

### Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| Onboarding / Tutorial | Warm, encouraging | "Each sheet is organized into tabs. Work at your own pace." |
| Form labels | Concise, clear | "Character Name", "Street Handle", "Clan" |
| Hints / descriptions | Helpful, informative | "Search for Disciplines by name — each entry includes a description." |
| Errors | Calm, actionable | "Failed to save. Check your connection and try again." |
| Empty states | Inviting | "No characters yet. Create your first one to get started." |
| Confirmations | Clear, reversible | "Delete this character? This cannot be undone." |
| Success states | Brief | "Saved." / "Character created." |

## Accessibility First

Every feature, every label, every interaction must work for everyone. Accessibility is not a checklist to satisfy after the fact — it is a design constraint that shapes every decision from the start. If a feature doesn't work with a keyboard, a screen reader, or on a 320px screen, it's not done.

This principle applies to writing as much as to code. The words we choose determine whether an interface is usable for people who:
- Navigate with a keyboard or switch device instead of a mouse
- Use a screen reader to hear the interface rather than see it
- Have low vision and rely on zoom, high contrast, or large text
- Have motor impairments that make precise gestures difficult
- Have cognitive or learning differences that require clear, predictable language

When in doubt, choose the option that works for the widest range of people. That option almost always works better for everyone.

---

## Writing Guidelines

### Do
- Use plain language — write for humans, not programmers
- Lead with what the user can DO, not how the system works internally
- Use sentence case for headings and labels (not Title Case for everything)
- Keep button text to 1-3 words: "Save", "Export PDF", "New Character"
- Write error messages that explain what to do next
- Use "you/your" to speak directly to the user
- Translate game-mechanical proper nouns consistently (keep Discipline, Gift, Spell in English across both languages)

### Don't
- Don't use "click" — say "select", "choose", "open", "use" (screen readers, touch, keyboard all work differently)
- Don't use jargon: "endpoint", "API", "fetch", "render" in user-facing text
- Don't use "please" excessively — one "please" per page maximum
- Don't use passive voice for instructions: "The character is saved" → "Your character has been saved"
- Don't use gendered language for roles: "the GM" not "he"
- Don't assume screen size: "the button on the right" → "the Export PDF button"

## Accessibility Writing

### Labels
- Every form input MUST have a visible label or aria-label
- Labels should describe what to enter, not how: "Character Name" not "Enter your character's name here"
- Group related fields with fieldset/legend
- Don't rely on placeholder text as the only label

### Error Messages
- State what went wrong: "Failed to load characters"
- State what to do: "Check your connection and try again"
- Use role="alert" so screen readers announce errors immediately

### Empty States
- Explain what this area is for
- Tell the user how to populate it
- Example: "No characters yet. Select 'New Character' to create your first one."

### Buttons & Actions
- Accessible button text describes the action: "Export PDF" not just "Export"
- Destructive actions use confirmation: "Delete [Character Name]? This cannot be undone."
- Disabled buttons should explain why (via tooltip or adjacent text)

### ARIA Patterns We Use

- **Tab interfaces:** `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-labelledby`, `aria-controls` on all 33 forms
- **Modals:** `aria-modal`, `aria-labelledby`, `autoFocus`, Escape to close, click-outside dismiss
- **Live regions:** `aria-live="polite"` for dynamic content, `role="alert"` for errors
- **Carousel navigation:** `role="group"`, dynamic aria-labels showing destination ("Previous: Stats")
- **Hamburger menu:** `aria-expanded` on toggle, closes on Escape/click-outside/navigation

### Writing for Screen Readers

- Button text must describe the action: "Export PDF" not just "Export"
- Destructive buttons include the target: "Delete Aria Venturi" not just "Delete"
- Icon-only buttons MUST have aria-label (hamburger, carousel arrows, close buttons)
- Dynamic content changes must be announced via aria-live regions
- Tab names are read aloud — keep them short and descriptive (1-3 words)
- Form legends describe the section: "Combat — Wound Track" not just "Combat"
- Error messages announce automatically via role="alert"

### Writing for Keyboard Users

- Never write "click" — use "select", "choose", "open", "use", "activate"
- Don't reference mouse-specific actions: "hover", "right-click", "drag"
- Don't reference position: "the button on the right" — use the button's label instead
- Interactive elements must have visible focus indicators (handled by CSS `:focus-visible`)
- Tab order must follow logical reading order (handled by DOM structure)

### Writing for Motor Impairments

- Touch targets are minimum 44px (WCAG 2.5.8)
- The carousel arrows provide an alternative to the dropdown for tab navigation
- The sticky bottom action bar keeps Save/Export always in thumb reach
- Don't require precise gestures — all interactions work with simple taps

### Writing for Low Vision

- Don't convey information through color alone — always pair with text
- Font sizes are set in `rem`, not `px`, so they respect browser zoom settings
- Minimum contrast ratio: 4.5:1 for normal text, 3:1 for large text (checked per theme)
- `muted-hint` text uses `--color-text-muted` which meets 4.5:1 on all backgrounds

### Writing for Cognitive Accessibility

- Use plain, direct language — avoid jargon and complex sentences
- One idea per sentence
- Consistent terminology: always use "Storyteller" not sometimes "GM" and sometimes "Storyteller"
- Error messages explain what happened AND what to do next
- Empty states explain what the area is for AND how to populate it
- Confirmations for destructive actions: "Delete [name]? This cannot be undone."

### Accessibility Testing Checklist

For every feature or UI change, verify the following before considering it complete:

- [ ] Can you complete the entire flow using only a keyboard (Tab, Enter, Escape)?
- [ ] Does VoiceOver/NVDA announce all form fields, buttons, and state changes?
- [ ] Are all images/icons either decorative (`aria-hidden`) or labeled (`aria-label`/`alt`)?
- [ ] Do error messages announce automatically?
- [ ] Does the page make sense when zoomed to 200%?
- [ ] Do all touch targets meet 44px minimum on mobile?
- [ ] Is color never the only way to convey information?
- [ ] Do all modals trap focus and close on Escape?
- [ ] Are all tab panels properly linked to their tab buttons via ARIA?
- [ ] Does the print/export output include all visible content?

## Translation Conventions

### Structure
- All user-facing strings go through the `t()` function from `useLanguage()`
- Translation keys use camelCase: `newCharBtn`, `failedToSave`, `cpWoundTrack`
- System-prefixed keys: `cp*` (Cyberpunk), `blades*` (Blades), `dnd*` (D&D)
- Tab keys: `tabCpIdentity`, `tabCpStats`, etc.

### What to Translate
- All UI labels, headings, legends, hints, placeholders, error messages, button text
- Tutorial and marketing copy on the homepage
- Empty state messages
- Confirmation dialogs

### What NOT to Translate
- Game-mechanical proper nouns: Discipline, Gift, Rote, Arcanoi, Edge, Lore, Art, Realm
- Character attribute names that are game terms: Strength, Dexterity, Rage, Gnosis, Arete
- Proper names of game entities: "Brujah", "Ventrue", "Silver Fangs", "Virtual Adepts"
- System names: "World of Darkness", "Blades in the Dark", "Cyberpunk 2020"
- Code/technical terms in developer docs

### Portuguese Conventions
- Use "voce" form (informal Brazilian Portuguese)
- "Storyteller" → "Narrador"
- "Player" → "Jogador"
- "Chronicle" → "Cronica"
- "Character Sheet" → "Ficha de Personagem" or just "Ficha"
- "Character" → "Personagem"
- "Save" → "Salvar"
- "Delete" → "Excluir"
- "Export" → "Exportar"
- "Search" → "Buscar"
- "New Character" → "Novo Personagem"

## Mobile Writing

- Keep labels short — mobile screens are narrow
- Use the hamburger menu label pattern: show the OTHER language's name ("Mudar Idioma" when in English, "Switch Language" when in Portuguese) so users recognize their target language
- Tab names should be 1-2 words maximum for the mobile dropdown
- Error messages should be readable without horizontal scrolling

## Numbers & Formatting
- Use numerals for game stats: "3 dots", "Level 5", "SP 14"
- Use words for small counts in prose: "one character", "two chronicles"
- Currency: "500eb" (Cyberpunk), "10 Septims" (UESTRPG), "100 koku" (L5R)
- Dice notation: "d10", "3d6+2", "d20" (always lowercase 'd')
