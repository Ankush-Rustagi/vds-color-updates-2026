/** Migration, dark mode, and platform reference links (external). */
export const MIGRATION_LINKS = {
  darkModeAuditPart1:
    'https://www.notion.so/vkda/Dark-Mode-Readiness-Audit-Overview-Part-1-of-2-33a3f042192681419303d8e74c6ffec0',
  darkModeAuditPart2: 'https://www.notion.so/33a3f042192681f78ae1d8400e2736bb',
  darkModeOverviewDeck:
    'https://docs.google.com/presentation/d/10TqZxWjmHtWWPa80sQgQjdxKwQVxHFXKpL6usa_NmIY/edit?slide=id.p#slide=id.p',
  verityMigrationMetrics:
    'https://ve2etests-reports.gaia-prod.cf.verkada.com/wpt/main/dashboards/migrations/verity.html',
  verityDarkModeStorybook:
    'https://master.vstyleguide.prod1.cf.verkada.com/?path=/docs/base-colors-dark-mode-migration--docs#scss-styling',
  darkModeMigrationGuide: 'https://www.notion.so/3293f042192680f89b97c05b27f7a35f',
  verityStorybook: 'https://master.vstyleguide.prod1.cf.verkada.com/',
} as const

export type MigrationLinkTarget = keyof typeof MIGRATION_LINKS
