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

export function docHref(slug: keyof typeof DOC_PATHS): string {
  return `/docs/${DOC_PATHS[slug]}--docs`
}

export function storybookPath(slug: keyof typeof DOC_PATHS): string {
  return `?path=/docs/${DOC_PATHS[slug]}--docs`
}
