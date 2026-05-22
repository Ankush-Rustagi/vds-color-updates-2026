import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { isStorybookDocHref, toStorybookHref } from '../../constants/doc-links'

/** True for http(s), protocol-relative, mailto, and tel links. */
export function isExternalHref(href?: string): boolean {
  if (!href) return false
  if (isStorybookDocHref(href)) return false
  const trimmed = href.trim()
  if (
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

/** Storybook docs anchor: external links open in a new tab; internal doc links navigate the manager shell. */
export function DocsAnchor({ href, children, target, rel, ...rest }: DocsAnchorProps) {
  const resolvedHref = href ? toStorybookHref(href) : href
  const external = isExternalHref(resolvedHref)
  const internalDoc = isStorybookDocHref(resolvedHref)

  return (
    <a
      href={resolvedHref}
      {...(external
        ? {
            target: target ?? '_blank',
            rel: rel ?? 'noopener noreferrer',
          }
        : internalDoc
          ? {
              target: target ?? '_parent',
              rel,
            }
          : { target, rel })}
      {...rest}
    >
      {children}
    </a>
  )
}
