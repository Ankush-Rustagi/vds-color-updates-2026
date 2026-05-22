/** Canonical Storybook doc paths (slug after /docs/, before --docs) */
export const DOC_PATHS = {
  strategy: 'intro-to-color-v2-strategy',
  rollout: 'intro-to-color-v2-rollout',
  whoDoesWhat: 'intro-to-color-v2-who-does-what',
  overview: 'color-v2-updates-overview',
  whatsChanging: 'color-v2-updates-what-s-changing',
  accessibility: 'color-v2-updates-accessibility',
  buildingNewUi: 'color-v2-updates-building-new-ui',
  gettingStarted: 'color-v2-migrations-getting-started',
  figmaWorkflow: 'color-v2-migrations-figma-workflow',
  tokenMapping: 'color-v2-migrations-token-mapping',
  alertButton: 'color-v2-migrations-alert-button',
  checkbox: 'color-v2-migrations-checkbox',
  semanticColors: 'reference-semantic-colors',
  colorPrimitives: 'reference-color-primitives',
  size: 'reference-size',
  effects: 'reference-effects',
  tokenNaming: 'reference-token-naming',
  teamsOverview: 'teams-overview',
} as const

/** Vite base path: `/` in dev, `/vds-color-updates-2026/` on GitHub Pages. */
export const STORYBOOK_BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/')

function buildStorybookHref(pathPart: string, extraQuery = ''): string {
  const query = extraQuery ? `&${extraQuery}` : ''
  return `${STORYBOOK_BASE}?path=${pathPart}${query}`
}

/** True when href is an in-app Storybook doc route (not external). */
export function isStorybookDocHref(href?: string): boolean {
  if (!href) return false
  const trimmed = href.trim()
  if (trimmed.startsWith('/docs/')) return true
  if (trimmed.startsWith('?path=')) return true
  if (trimmed.startsWith(STORYBOOK_BASE) && trimmed.includes('?path=')) return true
  if (trimmed.startsWith('#') || trimmed.startsWith('./') || trimmed.startsWith('../')) return false
  return false
}

/**
 * Convert `/docs/slug--docs` or `?path=/docs/...` to absolute manager-shell routing.
 * Docs render inside iframe.html; links must target the parent shell with BASE prefix.
 */
export function toStorybookHref(href: string): string {
  const trimmed = href.trim()

  if (trimmed.startsWith(STORYBOOK_BASE) && trimmed.includes('?path=')) {
    return trimmed
  }

  if (trimmed.startsWith('?path=')) {
    const pathAndQuery = trimmed.slice('?path='.length)
    const ampIndex = pathAndQuery.indexOf('&')
    const pathPart = ampIndex === -1 ? pathAndQuery : pathAndQuery.slice(0, ampIndex)
    const extraQuery = ampIndex === -1 ? '' : pathAndQuery.slice(ampIndex + 1)
    return buildStorybookHref(pathPart, extraQuery)
  }

  if (!trimmed.startsWith('/docs/')) return href

  const qIndex = trimmed.indexOf('?')
  const pathPart = qIndex === -1 ? trimmed : trimmed.slice(0, qIndex)
  const extraQuery = qIndex === -1 ? '' : trimmed.slice(qIndex + 1)
  return buildStorybookHref(pathPart, extraQuery)
}

export function docHref(slug: keyof typeof DOC_PATHS, extraQuery?: string): string {
  const path = `/docs/${DOC_PATHS[slug]}--docs`
  if (!extraQuery) return buildStorybookHref(path)
  const query = extraQuery.startsWith('?') ? extraQuery.slice(1) : extraQuery
  return buildStorybookHref(path, query)
}

export function storybookPath(slug: keyof typeof DOC_PATHS): string {
  return docHref(slug)
}
