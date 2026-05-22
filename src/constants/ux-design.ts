import { GITHUB_LINKS } from './github'

/** Verkada UX Design assets in docs-vibes — Claude Design, OpenDesign, vibe prototypes */
export const UX_DESIGN = {
  /** Path inside the docs-vibes repo (Verkada_Code/documentation/) */
  repoPath: 'documentation/17-ux-design/',
  /** Browse folder on GitHub (requires Verkada org access) */
  githubUrl: GITHUB_LINKS.docsVibesFolder,
  /** Direct file links on GitHub */
  files: {
    designMd: GITHUB_LINKS.docsVibesDesignMd,
    designSystemContext: GITHUB_LINKS.docsVibesDesignSystemContext,
    verityBridge: GITHUB_LINKS.docsVibesVerityBridge,
    verityFolder: GITHUB_LINKS.docsVibesVerityFolder,
    readme: GITHUB_LINKS.docsVibesReadme,
  },
} as const
