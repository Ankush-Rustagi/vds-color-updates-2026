import type { ReactNode } from 'react'
import { DocsAnchor } from './DocsAnchor'
import { MIGRATION_LINKS, type MigrationLinkTarget } from '../../constants/migration-links'

/** External migration / dark mode resource link for MDX pages. */
export function MigrationLink({ to, children }: { to: MigrationLinkTarget; children: ReactNode }) {
  return <DocsAnchor href={MIGRATION_LINKS[to]}>{children}</DocsAnchor>
}
