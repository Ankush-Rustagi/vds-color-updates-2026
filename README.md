# VDS Color Updates 2026 (Storybook)

VDS Color v2 migration guides, before/after demos, and token reference for Verkada Command product teams.

**Live site:** https://ankush-rustagi.github.io/vds-color-updates-2026/

**Vibe design assets:** `documentation/17-ux-design/` in [docs-vibes](https://github.com/verkada/docs-vibes/tree/main/17-ux-design) (DESIGN.md, design-system-context, Verity excerpts, icons, prompts for Claude Design and OpenDesign).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:6006

## Token refresh

When Figma Collection changes:

1. Export Collection metadata XML to `scripts/data/figma-collection-export.xml`
2. Run `npm run tokens:refresh`
3. Commit updated `src/tokens/generated/*.json`

CI builds use committed JSON only (no Python in CI).

## Structure

| Section | Content |
|---------|---------|
| Intro to Color v2 | Strategy, rollout, who does what |
| Color v2 Updates | Overview, scope, accessibility, greenfield |
| Color v2 Migrations | Getting started, Figma workflow, token mapping, Alert Button, Checkbox |
| Reference | TokenExplorer for semantic, primitives, size, effects |
| Teams | Product-line migration examples |

## Deploy

Push to `main` triggers GitHub Actions → GitHub Pages.

## Figma source

[VDS - Verkada Design System](https://www.figma.com/design/ErBiDvqI7wPQKKXWfhC6yl/VDS---Verkada-Design-System)

Collection frame: `73102:139464`
