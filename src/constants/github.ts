const DOCS_VIBES = 'https://github.com/verkada/docs-vibes'
const DOCS_VIBES_BRANCH = 'main'
const UX_FOLDER = '17-ux-design'

function docsVibesTree(subpath = '') {
  const suffix = subpath ? `/${subpath}` : ''
  return `${DOCS_VIBES}/tree/${DOCS_VIBES_BRANCH}/${UX_FOLDER}${suffix}`
}

function docsVibesBlob(filename: string) {
  return `${DOCS_VIBES}/blob/${DOCS_VIBES_BRANCH}/${UX_FOLDER}/${filename}`
}

/** Canonical GitHub URLs for Storybook MDX (markdown does not interpolate `{VAR}` in hrefs). */
export const GITHUB_LINKS = {
  docsVibesFolder: docsVibesTree(),
  docsVibesDesignMd: docsVibesBlob('DESIGN.md'),
  docsVibesDesignSystemContext: docsVibesBlob('design-system-context.md'),
  docsVibesVerityBridge: docsVibesBlob('vds-verity-component-bridge.md'),
  docsVibesVerityFolder: docsVibesTree('verity'),
  docsVibesReadme: docsVibesBlob('README.md'),
  storybookRepo: 'https://github.com/Ankush-Rustagi/vds-color-updates-2026',
  openDesignRepo: 'https://github.com/nexu-io/open-design',
} as const

export type GitHubLinkTarget = keyof typeof GITHUB_LINKS
