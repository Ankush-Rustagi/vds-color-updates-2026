# VDS Color v2 Storybook Content Model

**Purpose:** Phase 0B page inventory mapping content to format (CSF, MDX, React) and source of truth.

**Last updated:** May 2026

---

## Table of contents

1. [Content model (single site)](#content-model-single-site)
2. [MVP page inventory](#mvp-page-inventory)
3. [Phase 2b pages (fast follow)](#phase-2b-pages-fast-follow)
4. [Cross-links](#cross-links)

---

## Content model (single site)

All narrative, migration guides, token reference, and team examples live in this Storybook. There is no separate strategy hub.

| Content | Location in Storybook |
|---------|----------------------|
| Strategy, rollout, who-does-what | Intro to Color v2 |
| Getting started, Figma workflow, token mapping | Color v2 Migrations |
| Alert/Checkbox before-after | Color v2 Migrations (CSF) |
| Full token reference | Reference → Semantic Colors, etc. |
| Team migration examples | Teams |
| Vibe design assets (Claude Design, OpenDesign) | [17-ux-design](https://github.com/verkada/docs-vibes/tree/main/17-ux-design) in docs-vibes |

**Live URL:** https://ankush-rustagi.github.io/vds-color-updates-2026/

---

## MVP page inventory

### Foundations / Color v2

| Page | Format | Figma source | Notes |
|------|--------|--------------|-------|
| Overview | MDX + DocsTable | Deck slide 1 | Role picker; links to Intro to Color v2 |
| What's Changing | MDX + DocsTable | Slides 2–3 | Scope for eng leads |
| Accessibility | MDX + DocsTable | Slide 5 | Contrast constraints |
| Greenfield Adoption | MDX + DocsTable | Collection | Day-one token picks |

### Migrations / Color v2

| Page | Format | Figma source | Notes |
|------|--------|--------------|-------|
| Getting Started | MDX | Deck slides 1–4 | Numbered steps, `docs.toc: true` |
| Figma Workflow | MDX + DocsTable | Collection + deck | Deep links to Figma |
| Token Mapping | MDX + TokenMappingTable | Curated | ~25 legacy rows; link to Semantic Colors |
| Alert Button | CSF + MDX | Slide 6 | Before/after Canvas × 2 |
| Checkbox | CSF + MDX | Slides 8–9 | Before/after Canvas |

### Reference

| Page | Format | Figma source | Notes |
|------|--------|--------------|-------|
| Token Naming | MDX + DocsTable | Collection | CSS var transform rule |
| Semantic Colors | MDX + TokenExplorer | Table 73102:139626 | 566 rows, `toc: false` |
| Color Primitives | MDX + TokenExplorer | Table 73102:149124 | 237 rows |
| Size | MDX + TokenExplorer | Table 73102:151299 | 79 rows |
| Effects | MDX + TokenExplorer | Table 73102:151952 | 15 rows |

---

## Phase 2b pages (fast follow)

| Page | Format | Source |
|------|--------|--------|
| Teams Overview | MDX | Hub `data.ts` |
| Video Security | MDX + CSF Canvas | Hub team card |
| Access Control | MDX + CSF Canvas | Hub team card |
| Alarms | MDX + CSF Canvas | Hub team card |
| Intercom | MDX + CSF Canvas | Hub team card |
| Environmental Sensors | MDX + CSF Canvas | Hub team card |
| Guest | MDX + CSF Canvas | Hub team card |
| Maps | MDX + CSF Canvas | Hub team card |
| Command Analytics | MDX + CSF Canvas | Hub team card |

---

## Cross-links

| From | To |
|------|-----|
| Overview | Getting Started, Figma Workflow, Semantic Colors |
| Getting Started | Figma Workflow, Alert Button, Token Mapping |
| Figma Workflow | Collection (Figma), Semantic Colors |
| Token Mapping | Semantic Colors (full inventory) |
| Alert Button | Semantic Colors `?q=button/background/alert` |
| Every guide page | "Where to go next" (3 bullets max) |
| Reference footer | Collection frame in Figma |
