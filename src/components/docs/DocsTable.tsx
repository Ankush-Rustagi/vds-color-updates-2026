import type { ReactNode } from 'react'
import { isHex } from '../../tokens/collection'
import { DocsAnchor } from './DocsAnchor'
import { docHref, DOC_PATHS } from '../../constants/doc-links'

type DocsTableLayout = 'default' | 'rollout' | 'roles' | 'compare'

type DocsTableProps = {
  headers: string[]
  rows: (string | ReactNode)[][]
  /** Column indexes rendered as monospace code (string cells only) */
  codeColumns?: number[]
  /** Column indexes that show a color swatch when the cell is a hex value */
  hexColumns?: number[]
  /** Preset column width balance for common doc tables */
  layout?: DocsTableLayout
}

function Swatch({ value }: { value: string }) {
  if (!isHex(value)) return null
  return (
    <span
      className="vds-swatch"
      style={{ background: value }}
      title={value}
      aria-hidden="true"
    />
  )
}

function CellContent({
  value,
  code,
  hex,
}: {
  value: string | ReactNode
  code?: boolean
  hex?: boolean
}) {
  if (typeof value !== 'string') return <>{value}</>
  if (hex && isHex(value)) {
    return (
      <div className="vds-value-cell">
        <Swatch value={value} />
        <code className="vds-token-code">{value}</code>
      </div>
    )
  }
  if (code) {
    return <code className="vds-token-code">{value}</code>
  }
  return <>{value}</>
}

export function DocsTable({
  headers,
  rows,
  codeColumns = [],
  hexColumns = [],
  layout = 'default',
}: DocsTableProps) {
  const codeSet = new Set(codeColumns)
  const hexSet = new Set(hexColumns)
  const layoutClass =
    layout === 'default' ? '' : ` vds-table--${layout}`

  return (
    <div className="vds-table-wrap vds-docs-table">
      <table className={`vds-table${layoutClass}`}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <CellContent
                    value={cell}
                    code={codeSet.has(colIndex)}
                    hex={hexSet.has(colIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Internal Storybook doc link for DocsTable cells */
export function DocLink({
  href,
  slug,
  children,
}: {
  href?: string
  slug?: keyof typeof DOC_PATHS
  children: ReactNode
}) {
  const resolved = slug ? docHref(slug) : href
  if (!resolved) return <>{children}</>
  return <DocsAnchor href={resolved}>{children}</DocsAnchor>
}
