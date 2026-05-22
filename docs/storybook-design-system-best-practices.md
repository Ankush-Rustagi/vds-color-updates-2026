# Storybook Design System Best Practices

**Purpose:** Research-backed guide for building design system Storybooks correctly. Use this before changing the VDS Color v2 Storybook architecture.

**Audience:** PMs, designers, and engineers planning migration guides, token reference, and component documentation.

**Last updated:** May 2026

**Research sources:** Perplexity Deep Research (May 2026), official Storybook 8 docs ([storybook.js.org](https://storybook.js.org/docs)), Storybook design system repo ([storybookjs/design-system](https://github.com/storybookjs/design-system)), Chromatic public example ([storybook.design](https://storybook.design)).

---

## Table of contents

1. [Executive summary](#executive-summary)
2. [What went wrong in our first build](#what-went-wrong-in-our-first-build)
3. [The two-site model (strategy hub vs Storybook)](#the-two-site-model-strategy-hub-vs-storybook)
4. [Information architecture patterns](#information-architecture-patterns)
5. [CSF vs Autodocs vs MDX: decision matrix](#csf-vs-autodocs-vs-mdx-decision-matrix)
6. [Doc blocks and Canvas rules](#doc-blocks-and-canvas-rules)
7. [MDX tables and embedded UI](#mdx-tables-and-embedded-ui)
8. [Design token documentation](#design-token-documentation)
9. [Migration and before/after guides](#migration-and-beforeafter-guides)
10. [Navigation, TOC, and deep links](#navigation-toc-and-deep-links)
11. [Performance with large token sets](#performance-with-large-token-sets)
12. [Recommended repo structure for VDS Color v2](#recommended-repo-structure-for-vds-color-v2)
13. [Implementation checklist](#implementation-checklist)
14. [Reference links](#reference-links)

---

## Executive summary

A design system Storybook is not a dump of every Figma export into one page. It is a **layered documentation product** with clear rules for what belongs where.

| Layer | Best tool | Example content |
|-------|-----------|-----------------|
| **Component API + states** | CSF stories + Autodocs | Alert Button states, Checkbox matrix |
| **Guidelines and narratives** | MDX docs pages | Migration steps, accessibility notes |
| **Interactive demos** | CSF stories referenced by `<Canvas of={...} />` | Before/after comparisons |
| **Large reference data** | Dedicated React page or external tool | 566 semantic tokens |
| **Rollout strategy** | Separate docs hub (not Storybook) | Phases, team ownership, PM narrative |

**Core rule:** Stories live in CSF. Narrative docs live in MDX. Large data tables are React components, not MDX markdown pipes. Canvas `of` only references indexed CSF stories.

---

## What went wrong in our first build

These are the concrete failures from the VDS Color v2 Storybook v1 attempt and why they happened.

| Symptom | Root cause | Correct pattern |
|---------|------------|-----------------|
| Markdown tables rendered as one raw text line | MDX mixes JSX imports with pipe tables; Storybook MDX 2 does not reliably parse GFM tables after JSX | Use `<DocsTable />` React component or Autodocs tables, not pipe syntax in MDX |
| `Invalid value passed to the 'of' prop` | Referenced stories tagged `!dev`, which removes them from the Storybook index | Never point Canvas at hidden stories; use indexed CSF exports or embed components directly |
| Right nav showed 208 broken links | Every token group used an `<h3>`, which Storybook TOC auto-indexed | TOC only from intentional MDX headings; use one table or category pages |
| Right nav did not scroll to sections | React-rendered headings are not in Storybook's MDX TOC; `{#anchor}` syntax broke the MDX parser | Use MDX `## Heading` for TOC sections, or a custom in-page nav with explicit `id` + `scrollIntoView` |
| 208 one-row tables with huge whitespace | Grouped every Figma group into its own table + heading | One searchable table, or split by top-level category across separate MDX pages |
| CI build failed on deploy | `npm run build` called a Python parser that read a local-only Cursor cache file | Commit generated JSON; run parser locally via `npm run tokens:refresh` |
| Duplicate intro text | Same content in MDX `# Title` and inside the React component | MDX owns narrative; components own interactive UI only |

**Takeaway:** We treated Storybook as a generic React app. Storybook is a **docs compiler** with strict rules about what it can index, parse, and link.

---

## Single-site model (current)

VDS Color v2 uses **one Storybook** for strategy, migration, reference, and team examples. The former `vds-color-v2` rollout hub is archived and unpublished.

| Site | URL | Owns |
|------|-----|------|
| **Color v2 Storybook** | `vds-color-updates-2026/` | Intro to Color v2 (strategy, rollout, who does what), migrations, token reference, teams |
| **Vibe design assets** | `documentation/17-ux-design/` in docs-vibes | DESIGN.md, Claude Design setup, Verity handoff |

**Do not link to** `https://ankush-rustagi.github.io/vds-color-v2/` (retired).

---

## Information architecture patterns

### Pattern A: Foundation to implementation (Material-style)

Best for design systems where users learn tokens first, then components.

```
Foundations/
  Color/
    Overview
    Semantic tokens
    Primitives
  Typography/
  Spacing/
Components/
  Actions/
    Button
    Link
Patterns/
  Destructive actions
Guides/
  Migration from v1
  Accessibility
```

### Pattern B: Role-based entry (Polaris-style)

Same Storybook, different starting points linked from the hub:

| Role | Start page |
|------|------------|
| Designer | Figma workflow, token naming |
| Engineer | Getting started, token mapping |
| Eng lead / PM | What's changing (link out to hub for full strategy) |

### Pattern C: Problem-first (Primer-style)

Organize some guides by workflow ("Migrating destructive buttons") rather than only by component name. Useful for migration Storybooks like ours.

### Recommended sidebar for VDS Color v2

```
Foundations/Color v2/
  Overview
  What's changing
  Accessibility
  Rollout phases (short; link to hub for detail)
  Component docs index

Migrations/Color v2/
  Getting started
  Figma workflow
  Token mapping
  Alert button
  Checkbox

Teams/
  Overview
  [Product line examples]

Reference/
  Token naming
  Semantic colors
  Color primitives
  Size
  Effects
```

**Rules:**

- Max 3 sidebar levels deep.
- Reference section is for lookup, not narrative.
- Every page has one job.

---

## CSF vs Autodocs vs MDX: decision matrix

Official Storybook guidance ([CSF intro](https://storybook.js.org/docs/writing-stories/introduction), [Autodocs](https://storybook.js.org/docs/writing-docs/autodocs), [MDX](https://storybook.js.org/docs/writing-docs/mdx)):

| Need | Use | Why |
|------|-----|-----|
| Visual states, controls, a11y tests | **CSF** (`*.stories.tsx`) | Source of truth for stories; required for Canvas `of` |
| Auto-generated props table from component | **Autodocs** (`tags: ['autodocs']`) | Zero-maintenance API docs |
| Long-form guide, migration steps, tables | **MDX** (`*.mdx`) | Curated narrative layout |
| Embed a story in a guide | **MDX + `<Canvas of={Stories.X} />`** | Only when story is indexed |
| 500+ token rows with search | **React page** (optional separate route/tool) | MDX and Canvas are not data grids |

### What Storybook 7+ deprecated

- MDX-as-stories for interactions: prefer CSF ([discussion](https://github.com/storybookjs/storybook/discussions/24806)).
- Passing React components directly to `<Canvas of={...} />`: **invalid**.

### Recommended split for VDS

| Content | Format |
|---------|--------|
| AlertButton, Checkbox demos | CSF + Autodocs |
| Getting started, Figma workflow | MDX only (no Canvas unless pointing at CSF) |
| Token naming, dialect notes | MDX + React `DocsTable` |
| Full semantic token inventory | React `TokenReferencePage` OR split MDX pages per category |
| Team before/after | CSF stories referenced from MDX team pages |

---

## Doc blocks and Canvas rules

Official doc blocks reference: [Doc blocks](https://storybook.js.org/docs/writing-docs/doc-blocks#canvas)

### Canvas `of` prop rules

1. `of` must be a **CSF default export (meta)** or **named story export**.
2. The CSF file must match `stories` glob in `.storybook/main.ts`.
3. The story must be **indexed** (not tagged `!dev` unless you accept it will not work in Canvas).
4. Do not pass a React component, JSON, or hidden story.

**Valid:**

```tsx
// AlertButton.stories.tsx
export default { component: AlertButton, title: 'Migrations/Alert Button' }
export const BeforeAfterWhite = { ... }

// AlertButton.mdx
import * as Stories from './AlertButton.stories'
<Canvas of={Stories.BeforeAfterWhite} />
```

**Invalid:**

```tsx
// Reference.stories.tsx with tags: ['!dev']
<Canvas of={RefStories.SemanticTokens} />  // fails: not indexed
```

**Valid alternative for non-story UI:**

```mdx
import { SemanticTokenReference } from '../../src/components/SemanticTokenReference'
<SemanticTokenReference />
```

### Meta block rules

```mdx
<Meta title="Reference/Semantic Tokens" />
```

- `title` controls sidebar placement.
- Use `parameters={{ docs: { toc: true } }}` only when MDX headings define the TOC.

### Autodocs augmentation

For components, prefer:

```tsx
// AlertButton.stories.tsx
const meta = {
  component: AlertButton,
  title: 'Migrations/Color v2/Alert Button',
  tags: ['autodocs'],
}
```

Then optionally add `AlertButton.mdx` with `<Meta of={AlertButtonStories} />` for extra narrative ([Autodocs + MDX](https://storybook.js.org/docs/writing-docs/autodocs#augmenting-autodocs-with-mdx)).

---

## MDX tables and embedded UI

### Anti-pattern: pipe tables in MDX with JSX imports

```mdx
import { Meta } from '@storybook/blocks'
<Meta title="..." />

| Token | Value |
|-------|-------|
| --foo | #fff |
```

This often renders as a single broken line in Storybook 8.

### Pattern 1: React table component (what we should standardize on)

```mdx
import { DocsTable } from '../../src/components/DocsTable'

<DocsTable
  headers={['Token', 'Meaning']}
  codeColumns={[0]}
  rows={[['--button/background/alert', 'Alert fill']]}
/>
```

### Pattern 2: MDX headings only for structure

Use markdown headings for sections Storybook TOC should index:

```mdx
## Pattern

## Examples
```

Do **not** use `{#custom-id}` syntax in Storybook MDX if it breaks the parser (confirmed in our build).

For custom IDs, use HTML:

```mdx
<h2 id="token-naming-pattern">Pattern</h2>
```

Note: HTML headings may not appear in Storybook's auto-TOC. Prefer markdown `##` for TOC-visible sections.

### Pattern 3: Embed static components, not Canvas, for data UIs

Token reference, search, filters = React component embedded in MDX. Not a story. Not pipe tables.

---

## Design token documentation

Official starting point: [Documenting design tokens](https://storybook.js.org/docs/configure/styling-and-css#documenting-design-tokens)

### Three tiers of token docs

| Tier | Content | Recommended surface |
|------|---------|---------------------|
| **Conceptual** | Semantic vs primitive, naming, when to use | MDX pages (Token Naming, short examples) |
| **Curated samples** | Alert red, surface-01, focus ring | MDX `DocsTable` with swatches (10 to 30 rows) |
| **Full inventory** | 566 semantic tokens from Figma | React reference page with search, or split by category |

### Industry patterns (from research)

1. **Storybook design system** ([storybook.design](https://storybook.design/?path=/docs/design-system-foundations-introduction--docs)): Foundations as docs pages with controlled examples, not raw exports.
2. **Separate token explorer**: Some teams use Zeroheight, Supernova, or a custom Vite app for full token search; Storybook links out.
3. **Monorepo tokens as source of truth**: JSON or Style Dictionary output committed to repo; Storybook reads JSON at build time.

### Recommended VDS token approach

```
src/tokens/generated/     # Committed JSON from Figma export script
src/components/reference/   # SemanticTokenPage, PrimitivesPage, etc.
stories/reference/*.mdx     # Thin MDX wrapper: title + intro + <Component />
scripts/tokens:refresh      # Local-only Figma re-export (not in CI build)
```

**UI requirements for full inventory:**

- Single searchable table (default view)
- Optional group filter dropdown
- Columns: Group | Token | Light swatch + hex | Dark swatch + hex | Step
- Category jump nav (custom, not 208 MDX headings)
- No repeated table headers per row group

**Do not:** Render 208 `<h3>` sections to mirror Figma groups.

---

## Migration and before/after guides

Best practices for rollout Storybooks (industry + our use case):

### Structure each migration doc as

1. **Context** (1 paragraph): which Figma slide / pattern
2. **Token mapping table** (small, curated): legacy to v2
3. **Before/after Canvas** from CSF stories (white + surface-01 backgrounds)
4. **Checklist**: what to verify in PR

### CSF story naming convention

```
Migrations/Color v2/Alert Button/
  BeforeAfterWhite
  BeforeAfterSurface01
  AllStates
```

Use `parameters.layout: 'padded'` and theme toolbar for light/dark.

### Before/after implementation

- One CSF file per component pattern.
- `BeforeAfter` wrapper component for layout consistency.
- Legacy CSS vars on left, v2 tokens on right.
- No business logic in MDX.

### Team pages

Each product line page should:

- Link to one representative migration (not recreate tokens).
- Use `<Canvas of={TeamStories.VideoSecurity} />` from indexed CSF.
- Status pill: example-ready / in-progress / not-started.

---

## Navigation, TOC, and deep links

Official docs: [MDX table of contents](https://storybook.js.org/docs/writing-docs/mdx#table-of-contents), [Headings and navigation](https://storybook.js.org/docs/writing-docs/mdx#headings-and-navigation)

### How Storybook TOC works

- Generated from **MDX markdown headings** (`#`, `##`, `###`).
- Typically does **not** index headings rendered inside React components at runtime.
- Clicking TOC links scrolls to heading anchors auto-generated from heading text.

### Implications

| Approach | TOC works? | Deep link works? |
|----------|------------|------------------|
| MDX `## Section` | Yes | Yes |
| React `<h2>` inside component | No | Yes (manual `#id` in URL) |
| 208 React `<h3>` group titles | Floods or breaks TOC | Unusable |
| Custom `ReferenceToc` component | Parallel nav | Yes, with `scrollIntoView` |

### Recommended strategy for VDS

**For guide pages** (Token Naming, Getting Started):

- Use MDX `##` headings only.
- Keep `docs.toc: true` in preview defaults.
- Add `scroll-margin-top` CSS for headings.

**For full token reference:**

- Set `parameters.docs.toc: false` on that MDX page.
- Use a **custom right-rail TOC** (`ReferenceToc`) with explicit anchor IDs:
  - Overview
  - Search and filter
  - Top-level categories (button, background, text, etc.; about 29 items)
- Category sections use `<h2 id="semantic-button">` inside React (for scroll targets), listed in custom TOC only.

**Do not mix** Storybook auto-TOC and 29+ React headings on the same page.

### Stable deep links

Share URLs like:

```
?path=/docs/reference-semantic-tokens--docs#semantic-button
```

Test hash navigation after deploy on GitHub Pages (base path `/vds-color-v2-storybook/`).

---

## Performance with large token sets

Official: [Storybook 8 migration performance notes](https://storybook.js.org/docs/8/migration-guide#performance-and-stability-improvements)

| Risk | Mitigation |
|------|------------|
| 566 rows in one DOM table | Virtualized table (`@tanstack/react-virtual`) if render slows |
| Importing full JSON in every page | Code-split reference pages; lazy load token JSON |
| Huge single MDX page | Split into Semantic / Primitives / Size / Effects pages (already done) |
| Running Figma parser in CI | Never; commit `generated/*.json` |
| Many Canvas embeds on one MDX page | Max 2 to 3 Canvas blocks per page |

**Target:** Reference page interactive search under 100ms; initial docs load under 3s on GitHub Pages.

---

## Recommended repo structure for VDS Color v2

Based on [Storybook design system repo](https://github.com/storybookjs/design-system) and official configure docs:

```
vds-color-v2-storybook/
├── .storybook/
│   ├── main.ts              # stories glob: **/*.mdx, **/*.stories.*
│   ├── preview.tsx          # theme toolbar, storySort, docs.toc default
│   └── manager.ts           # optional: brand title/url
├── docs/
│   └── storybook-design-system-best-practices.md   # this file
├── scripts/
│   └── parse-figma-collection.py   # local refresh only
├── src/
│   ├── components/
│   │   ├── AlertButton.tsx
│   │   ├── Checkbox.tsx
│   │   ├── BeforeAfter.tsx
│   │   ├── DocsTable.tsx           # MDX-safe tables
│   │   ├── reference/
│   │   │   ├── SemanticTokenPage.tsx
│   │   │   ├── PrimitivesPage.tsx
│   │   │   └── ReferenceToc.tsx
│   │   └── ...
│   ├── tokens/
│   │   ├── generated/*.json        # committed, CI-safe
│   │   ├── vds-tokens.css
│   │   └── collection.ts
│   └── styles/
│       ├── global.css
│       └── docs.css                # sbdocs + reference layout
├── stories/
│   ├── foundations/*.mdx
│   ├── migrations/
│   │   ├── *.mdx
│   │   └── *.stories.tsx           # CSF colocated with MDX
│   ├── teams/
│   │   ├── *.mdx
│   │   └── Team.stories.tsx
│   └── reference/
│       └── *.mdx                   # thin wrappers, no business logic
└── package.json
```

### Colocation rule

For each migration component:

```
stories/migrations/AlertButton.mdx
stories/migrations/AlertButton.stories.tsx
src/components/AlertButton.tsx
```

MDX imports `./AlertButton.stories` for Canvas. Component lives in `src/`.

---

## Implementation checklist

Use this before shipping Storybook changes.

### Architecture

- [ ] Strategy narrative lives in docs hub, not Storybook
- [ ] Sidebar depth ≤ 3 levels
- [ ] Each page has a single clear purpose

### CSF and Canvas

- [ ] Every `<Canvas of={...} />` points to an indexed CSF story
- [ ] No `!dev` tag on stories referenced from MDX
- [ ] Component demos have `tags: ['autodocs']` where appropriate

### MDX

- [ ] No pipe markdown tables in MDX files with JSX imports
- [ ] Use `DocsTable` or Autodocs for tables
- [ ] Headings for TOC are markdown `##`, not JSX `{#id}` syntax
- [ ] Max 2 to 3 Canvas blocks per MDX page

### Token reference

- [ ] Full inventory in React, not MDX loops
- [ ] Generated JSON committed; CI does not run Figma parser
- [ ] Search + filter on one table (or virtualized table)
- [ ] Custom TOC OR category split pages, not 208 headings

### Navigation

- [ ] Guide pages: Storybook `docs.toc: true`
- [ ] Reference pages: `docs.toc: false` + custom `ReferenceToc`
- [ ] `scroll-margin-top` on anchor targets
- [ ] Hash links tested on GitHub Pages base path

### Migration guides

- [ ] Curated mapping table (not full inventory)
- [ ] Before/after CSF stories on white and surface-01
- [ ] Link to semantic reference for full lookup

### Deploy

- [ ] `npm run build` succeeds without local-only files
- [ ] GitHub Actions deploy verified
- [ ] Hard refresh tested after deploy

---

## Reference links

### Official Storybook 8

| Topic | URL |
|-------|-----|
| MDX docs | https://storybook.js.org/docs/writing-docs/mdx |
| Autodocs | https://storybook.js.org/docs/writing-docs/autodocs |
| Doc blocks (Canvas, Meta) | https://storybook.js.org/docs/writing-docs/doc-blocks |
| CSF stories | https://storybook.js.org/docs/writing-stories/introduction |
| Story tags (`!dev`, `autodocs`) | https://storybook.js.org/docs/writing-stories/tags |
| MDX TOC | https://storybook.js.org/docs/writing-docs/mdx#table-of-contents |
| Design tokens | https://storybook.js.org/docs/configure/styling-and-css#documenting-design-tokens |
| Storybook 8 migration | https://storybook.js.org/docs/8/migration-guide |
| Configure story loading | https://storybook.js.org/docs/configure/overview#configure-story-loading |

### Canonical examples

| Example | URL |
|---------|-----|
| Storybook design system (live) | https://storybook.design |
| Storybook design system (source) | https://github.com/storybookjs/design-system |
| Design systems tutorial | https://storybook.js.org/tutorials/design-systems-for-developers/ |
| Figma addon | https://storybook.js.org/addons/@storybook/addon-designs |

### VDS project links

| Resource | URL |
|----------|-----|
| VDS Color v2 Storybook | https://ankush-rustagi.github.io/vds-color-updates-2026/ |
| 17-ux-design (vibe / Claude Design) | https://github.com/verkada/docs-vibes/tree/main/17-ux-design |
| VDS Figma | https://www.figma.com/design/ErBiDvqI7wPQKKXWfhC6yl/VDS---Verkada-Design-System |

---

## Next step: rebuild plan

Do not patch the current Storybook incrementally. Use this sequence:

1. **Freeze content model** using the checklist above.
2. **Split token reference** into thin MDX + `SemanticTokenPage` React with virtualized or single-table UI and custom TOC (29 categories, not 208).
3. **Audit every MDX file** for pipe tables and invalid Canvas references.
4. **Colocate CSF** with migration MDX; verify each Canvas target in dev tools.
5. **Test TOC and hash links** locally and on GitHub Pages.
6. **Link hub ↔ Storybook** with stable `/docs/...` paths only after deploy.

This document is the source of truth for that rebuild.
