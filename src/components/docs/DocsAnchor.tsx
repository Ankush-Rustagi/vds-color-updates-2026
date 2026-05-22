import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { toStorybookHref } from '../../constants/doc-links'

/** True for http(s), protocol-relative, mailto, and tel links. */
export function isExternalHref(href?: string): boolean {
  if (!href) return false
  const trimmed = href.trim()
  if (
    trimmed.startsWith('/docs/') ||
    trimmed.startsWith('?path=') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  ) {
    return false
  }
  return /^(https?:|mailto:|tel:|\/\/)/i.test(trimmed)
}

type DocsAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string
  children?: ReactNode
}

/** Storybook docs anchor: external links open in a new tab; internal doc links stay in-app. */
export function DocsAnchor({ href, children, target, rel, ...rest }: DocsAnchorProps) {
  const resolvedHref = href ? toStorybookHref(href) : href
  const external = isExternalHref(resolvedHref)

  return (
    <a
      href={resolvedHref}
      {...(external
        ? {
            target: target ?? '_blank',
            rel: rel ?? 'noopener noreferrer',
          }
        : { target, rel })}
      {...rest}
    >
      {children}
    </a>
  )
}
