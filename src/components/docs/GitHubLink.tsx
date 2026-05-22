import type { ReactNode } from 'react'
import { GITHUB_LINKS, type GitHubLinkTarget } from '../../constants/github'

/** External GitHub deep link for MDX pages. */
export function GitHubLink({ to, children }: { to: GitHubLinkTarget; children: ReactNode }) {
  return (
    <a href={GITHUB_LINKS[to]} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
