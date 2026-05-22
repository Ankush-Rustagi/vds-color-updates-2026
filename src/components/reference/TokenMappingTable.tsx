import { useMemo, useState } from 'react'
import { TOKEN_MAPPINGS } from '../../content/token-mappings'

export function TokenMappingTable() {
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TOKEN_MAPPINGS
    return TOKEN_MAPPINGS.filter(
      (r) =>
        r.legacy.toLowerCase().includes(q) ||
        r.v2.toLowerCase().includes(q) ||
        (r.notes || '').toLowerCase().includes(q),
    )
  }, [query])

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
        <table className="vds-table">
          <thead>
            <tr>
              <th>Legacy variable</th>
              <th>Color v2 token</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
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
