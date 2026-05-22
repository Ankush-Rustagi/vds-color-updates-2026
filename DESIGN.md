# Verkada Design System (VDS) — Color v2

**Version:** 2026-05 (Color v2 semantic tokens)  
**Status:** Active migration. Figma Collection is authoritative.  
**Canonical reference:** https://ankush-rustagi.github.io/vds-color-updates-2026/

This file follows the [OpenDesign](https://github.com/nexu-io/open-design) pattern: a single markdown spec for AI design and code agents. **Do not invent colors, token names, or component variants not listed here.**

---

## Principles

1. **Semantic tokens only in product UI.** Bind components to `--{component}/{property}/{state}`. Never hardcode hex in designs or prototypes.
2. **Figma Collection is source of truth.** 566 semantic color tokens with paired light and dark values. Primitives (237 steps) resolve into semantics at the component layer.
3. **One naming rule.** Figma: `--button/background/alert`. CSS in Command: `--vds-button-background-alert` (slashes become hyphens, `--vds-` prefix).
4. **No local overrides.** If a token is missing, flag Design System. Do not ship team-specific colors.
5. **Enterprise clarity.** Dense information, clear status, confident primary actions. One Primary Button per view.

---

## Design Tokens (Color v2)

### Naming convention

```
--{component}/{property}/{state}
```

Examples: `--text/emphasis`, `--button/background/primary`, `--checkbox/default-border-hover`

### Core surfaces and text (light mode)

Use these for page layout and typography. Dark mode values exist in Collection; production dark theme is still under validation.

| Token | Light hex | Use |
|-------|-----------|-----|
| `--background/surface-01` | `#F7F9FB` | App canvas, page background |
| `--background/surface-02` | `#FFFFFF` | Cards, panels, modals |
| `--background/elevated-on-surface` | `#FFFFFF` | Dropdowns, popovers, tooltips |
| `--background/surface-01-hover` | `#DCE0E4` | Row hover, list item hover |
| `--text/emphasis` | `#030E16` | Headings, primary emphasis |
| `--text/primary` | `#232426` | Body text, default labels |
| `--text/secondary` | `#536573` | Supporting text, placeholders |
| `--misc/divider-01` | `#EAEFF3` | Dividers, subtle separators |
| `--border/focus-ring` | `#0285C8` | Focus ring on inputs |

### Interactive and status

| Token | Light hex | Use |
|-------|-----------|-----|
| `--button/background/primary` | `#0285C8` | Primary button fill (brand cyan) |
| `--button/background/alert` | `#CB2939` | Destructive / danger button fill |
| `--button/text/on-primary` | `#FFFFFF` | Text on primary fill |
| `--link/shape/primary` | `#0285C8` | Hyperlinks |
| `--support/alert` | `#CB2939` | Error / alert accent |
| `--support/success` | `#14BA74` | Success states |
| `--support/warning` | `#FFD959` | Warning states |

### Legacy → v2 mapping (do not use legacy in new work)

| Legacy (deprecated) | Color v2 replacement |
|---------------------|----------------------|
| `--bg-canvas` | `--background/surface-01` |
| `--bg-surface` | `--background/surface-02` |
| `--bg-hover` | `--background/surface-01-hover` |
| `--fg-primary` | `--text/emphasis` |
| `--fg-secondary` | `--text/secondary` |
| `--accent` | `--button/background/primary` |
| `--status-error` / `#DA5959` | `--button/background/alert` / `#CB2939` |
| `--border-subtle` | `--misc/divider-01` |

Full inventory (566 semantic, 237 primitives): Storybook → Reference → Semantic Colors.

---

## Components

Implement with **Verity** (`@verkada/verity`). Use VDS names in prompts and specs.

### Buttons

| VDS name | Verity | When to use |
|----------|--------|-------------|
| Primary Button | `Button.Primary` | One main action per view. Cyan fill. |
| Secondary Button | `Button.Secondary` | Secondary action. White fill, border. |
| Ghost Button | `Button.Tertiary` | Low emphasis. Text only. |
| Danger / Alert Button | `Button.Alert` | Destructive only. Red `#CB2939`. Requires confirmation. |
| Transparent Button | `Button.Transparent` | Toolbar icon actions. |

**Sizes:** `small`, `medium`, `large`

### Forms

Checkbox, Radio, Switch, Text Field, Select Field. Checkbox reference migration: `--checkbox/default-background`, `--checkbox/default-border`, `--checkbox/selected-background`.

### Data display

Data Table (sortable, checkbox selection), Surface Card, Status Badge, Tag/Label.

### Navigation

Left Nav (240px), Top Nav (40px), Navigation Tabs within pages.

### Overlays

Modal (confirm destructive actions), Popover, Tooltip, Banner/Toast.

---

## Layout (Verkada Command)

```
┌─────────────────────────────────────────────────────────┐
│  Top Nav (40px) — Search | Alerts | User | Org          │
├──────────┬──────────────────────────────────────────────┤
│  Left    │    Main Content Area                         │
│  Sidebar │    Page Header → Filter/Tabs → Content       │
│  240px   │                                              │
└──────────┴──────────────────────────────────────────────┘
```

**Sidebar order:** Cameras, Access Control, Alarms, Sensors, Intercoms, Workplace, then org/site selector and Settings.

---

## Patterns

- **Empty states:** Illustration + headline + Primary Button CTA.
- **Loading:** Skeleton for tables/cards; Spinner for inline.
- **Row hover:** `--background/surface-01-hover`. Selected: surface active tokens.
- **Danger actions:** Modal confirmation before execute.
- **Bulk actions:** Sticky bar when rows selected.

---

## Accessibility

- Meet WCAG AA contrast for text on surfaces. Validate alert red `#CB2939` on white for small text.
- Never rely on color alone for status; pair with icon or label.
- Focus visible: `--border/focus-ring` on all interactive controls.

---

## Typography (unchanged in Color v2)

**Font:** Open Sans (UI), Roboto Mono (device IDs, code).

| Class | Size | Weight |
|-------|------|--------|
| `.vds-h1` | 32px | 500 |
| `.vds-h2` | 24px | 500 |
| `.vds-body` | 14px | 400 |
| `.vds-label` | 14px | 600 |
| `.vds-button` | 14px | 600 |

---

## Spacing and radius (unchanged)

4px base: `--space-1` (4px) through `--space-10` (40px).  
Radius: `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px.

---

## Agent constraints

- **Do not** use legacy tokens (`--bg-canvas`, `--fg-primary`, `--accent`) in new designs.
- **Do not** use `#DA5959` for alert red; use `#CB2939` via `--button/background/alert`.
- **Do not** add Primary Buttons beyond one per view.
- **Do not** use red except destructive actions.
- **Do** cite semantic token names when specifying colors.
- **Do** use Verity import paths from `@verkada/verity/consumables/`.

**Last updated:** May 2026
