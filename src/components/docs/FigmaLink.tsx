import type { ReactNode } from 'react'
import { DocsAnchor } from './DocsAnchor'
import { FIGMA_LINKS } from '../../constants/figma'

export type FigmaLinkTarget = keyof typeof FIGMA_LINKS

/** External Figma deep link for MDX pages (markdown `[text]({FIGMA_LINKS.x})` does not interpolate). */
export function FigmaLink({ to, children }: { to: FigmaLinkTarget; children: ReactNode }) {
  return <DocsAnchor href={FIGMA_LINKS[to]}>{children}</DocsAnchor>
}
