import type { ReactNode } from 'react'
import { DocsAnchor } from './DocsAnchor'
import { GITHUB_LINKS, type GitHubLinkTarget } from '../../constants/github'

/** External GitHub deep link for MDX pages. */
export function GitHubLink({ to, children }: { to: GitHubLinkTarget; children: ReactNode }) {
  return <DocsAnchor href={GITHUB_LINKS[to]}>{children}</DocsAnchor>
}
