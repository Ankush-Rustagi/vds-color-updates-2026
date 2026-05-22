import { useMemo, useState } from 'react'
import { TOKEN_MAPPINGS, type TokenMapping } from '../../content/token-mappings'
import { SortHeader } from './SortHeader'
import { nextSortDirection, type SortDirection } from './sort-utils'

type SortColumn = 'legacy' | 'v2' | 'notes'

export function TokenMappingTable() {
  const [query, setQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<SortColumn>('legacy')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = !q
      ? TOKEN_MAPPINGS
      : TOKEN_MAPPINGS.filter(
          (r) =>
            r.legacy.toLowerCase().includes(q) ||
            r.v2.toLowerCase().includes(q) ||
            (r.notes || '').toLowerCase().includes(q),
        )

    return [...filtered].sort((a, b) => {
      const cmp = (a[sortColumn] ?? '').localeCompare(b[sortColumn] ?? '', undefined, {
        numeric: true,
        sensitivity: 'base',
      })
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [query, sortColumn, sortDirection])

  const handleSort = (column: SortColumn) => {
    setSortDirection((prev) => nextSortDirection(sortColumn, prev, column))
    setSortColumn(column)
  }

  return (
    <div className="vds-ref">
      <div className="vds-ref__toolbar">
        <input
          className="vds-input"
          type="search"
          placeholder="Search legacy or v2 token…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="vds-count">{rows.length} mappings</span>
      </div>
      <div className="vds-table-wrap">
        <table className="vds-table vds-table--sortable">
          <thead>
            <tr>
              <th>
                <SortHeader
                  label="Legacy variable"
                  column="legacy"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={(col) => handleSort(col as SortColumn)}
                />
              </th>
              <th>
                <SortHeader
                  label="Color v2 token"
                  column="v2"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={(col) => handleSort(col as SortColumn)}
                />
              </th>
              <th>
                <SortHeader
                  label="Notes"
                  column="notes"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={(col) => handleSort(col as SortColumn)}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: TokenMapping) => (
              <tr key={row.legacy}>
                <td>
                  <code className="vds-token-code">{row.legacy}</code>
                </td>
                <td>
                  <code className="vds-token-code">{row.v2}</code>
                </td>
                <td className="vds-muted">{row.notes || 'n/a'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
