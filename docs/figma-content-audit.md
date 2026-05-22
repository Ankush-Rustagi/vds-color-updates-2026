# VDS Figma Content Audit

**Purpose:** Phase 0A deliverable documenting Figma source assets, token counts, taxonomy, and deep links for Storybook v2.

**Last updated:** May 2026

**Figma file:** [VDS - Verkada Design System](https://www.figma.com/design/ErBiDvqI7wPQKKXWfhC6yl/VDS---Verkada-Design-System)

---

## Table of contents

1. [Asset inventory](#asset-inventory)
2. [Token counts (validated export)](#token-counts-validated-export)
3. [Group taxonomy](#group-taxonomy)
4. [Color Updates deck (slides 1–10)](#color-updates-deck-slides-110)
5. [Figma deep links](#figma-deep-links)
6. [CSS var naming rule](#css-var-naming-rule)
7. [Gaps vs v1 Storybook](#gaps-vs-v1-storybook)

---

## Asset inventory

| Asset | Node ID | Role in Storybook v2 |
|-------|---------|----------------------|
| Collection frame | `73102:139464` | Source of truth for token JSON pipeline |
| Semantic table | `73102:139626` | Parsed to `semantic-colors.json` |
| Primitives table | `73102:149124` | Parsed to `color-primitives.json` |
| Size table | `73102:151299` | Parsed to `size.json` |
| Effects table | `73102:151952` | Parsed to `effects.json` |
| Color Updates deck | Colors page, slides 1–10 | Migration narrative; Alert Button (6), Checkbox (8–9) |

**Export method:** Figma MCP metadata XML committed at `scripts/data/figma-collection-export.xml`. Parser: `scripts/parse-figma-collection.py`. CI build uses committed JSON only.

---

## Token counts (validated export)

| Dataset | Rows | Notes |
|---------|------|-------|
| Semantic colors | 566 | Light + dark columns; dark labeled "Dark Mode Testing" in Figma |
| Color primitives | 237 | Palette steps |
| Size | 79 | icon, radius, space, stroke |
| Effects | 15 | blur, opacity, scrim |
| Semantic groups | 208 | Figma group headers in Collection table |
| Top-level categories | 29 | First path segment of group key |

---

## Group taxonomy

**Rule:** Top-level category = first segment of the semantic `group` field (e.g. `button/background` → category `button`).

**29 categories** (token count from May 2026 export):

| Category | Tokens |
|----------|--------|
| button | 109 |
| misc | 74 |
| badges | 65 |
| link | 52 |
| banner | 37 |
| icon | 22 |
| background | 21 |
| field | 20 |
| border | 18 |
| text | 17 |
| toggle | 16 |
| checkbox | 14 |
| radio | 14 |
| tags | 14 |
| critical alerts | 10 |
| calendar | 8 |
| message | 8 |
| support | 8 |
| overlay | 7 |
| meta item | 6 |
| table | 6 |
| device | 5 |
| modal | 4 |
| scheduler | 4 |
| shadow | 3 |
| attention | 1 |
| default | 1 |
| disabled | 1 |
| on | 1 |

TokenExplorer uses this list for category jump chips. Group dropdown uses all 208 Figma groups.

---

## Color Updates deck (slides 1–10)

| Slide | Content | Storybook page |
|-------|---------|----------------|
| 1 | Rollout overview, why v2 | Hub (strategy); Foundations Overview (1 paragraph + link) |
| 2 | Scope: 567 semantic tokens | Foundations What's Changing |
| 3 | Visual deltas warning | Foundations What's Changing, Accessibility |
| 4 | Component state matrices intro | Getting Started |
| 5 | Accessibility / contrast | Foundations Accessibility |
| 6 | Alert Button pattern (5 states, white + surface-01) | Migrations Alert Button |
| 7 | Primary / secondary button context | Token Mapping (reference) |
| 8 | Checkbox default path | Migrations Checkbox |
| 9 | Checkbox alert path | Migrations Checkbox |
| 10 | Next steps / team rollout | Hub team cards; Teams pages (Phase 2b) |

---

## Figma deep links

Base: `https://www.figma.com/design/ErBiDvqI7wPQKKXWfhC6yl/VDS---Verkada-Design-System`

| Target | URL |
|--------|-----|
| File root | `?node-id=0-1` |
| Collection frame | `?node-id=73102-139464` |
| Semantic table | `?node-id=73102-139626` |
| Color Updates deck | Navigate via Colors page in file (slides 1–10) |
| Alert Button (slide 6) | Linked from deck on Colors page |
| Checkbox (slides 8–9) | Linked from deck on Colors page |

Storybook pages use "Open in Figma" links to Collection (`73102-139464`) and file root. Slide-specific node IDs live inside the deck frame; designers open the deck and jump to slides 6, 8, 9.

---

## CSS var naming rule

Figma token names use slashes. CSS custom properties map as follows:

```
Figma:  --button/background/alert
CSS:    --vds-button-background-alert
```

**Transform:** Strip leading `--`, replace `/` with `-`, prefix `--vds-`, lowercase.

TokenExplorer "Copy CSS" outputs: `--vds-button-background-alert: #cb2939;` using light hex by default.

Documented on Reference / Token Naming page.

---

## Gaps vs v1 Storybook

| v1 issue | v2 fix |
|----------|--------|
| Parser read Cursor cache path | Repo-local `scripts/data/figma-collection-export.xml` |
| 208 MDX headings broke TOC | TokenExplorer with 29 category chips |
| MDX pipe tables | DocsTable React component |
| ReferenceToc hacks | `docs.toc: false` on toolkit pages; custom explorer nav |
| Rollout phases in Storybook | Removed; hub owns PM narrative |
| Figma iframe embeds | Deep links only |
