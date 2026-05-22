import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  COLOR_PRIMITIVES,
  EFFECTS_TOKENS,
  SEMANTIC_GROUPS,
  SEMANTIC_TOKENS,
  SIZE_TOKENS,
  TOP_CATEGORIES,
  TOKEN_META,
  isHex,
  type SemanticTokenRow,
  type SimpleTokenRow,
} from '../../tokens/collection'
import { copyText, cssDeclaration, figmaToCssVar, topCategory } from '../../tokens/token-utils'
import { FIGMA_LINKS } from '../../constants/figma'

export type TokenDataset = 'semantic-colors' | 'color-primitives' | 'size' | 'effects'

type Props = {
  dataset: TokenDataset
  title?: string
}

type Row = SemanticTokenRow | SimpleTokenRow

function isSemantic(row: Row): row is SemanticTokenRow {
  return 'light' in row
}

function Swatch({ value }: { value?: string | null }) {
  if (!value || !isHex(value)) {
    return <span className="vds-swatch vds-swatch--empty" title="No swatch">—</span>
  }
  return <span className="vds-swatch" style={{ background: value }} title={value} aria-hidden />
}

function CopyButton({ label, value, onCopied }: { label: string; value: string; onCopied: () => void }) {
  return (
    <button
      type="button"
      className="vds-copy-btn"
      title={`Copy ${label}`}
      onClick={async () => {
        if (await copyText(value)) onCopied()
      }}
    >
      {label}
    </button>
  )
}

function readUrlParams(): { q: string; group: string; category: string } {
  if (typeof window === 'undefined') return { q: '', group: '', category: '' }
  const params = new URLSearchParams(window.location.search)
  return {
    q: params.get('q') ?? '',
    group: params.get('group') ?? '',
    category: params.get('category') ?? '',
  }
}

function writeUrlParams(q: string, group: string, category: string) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (q) params.set('q', q)
  else params.delete('q')
  if (group) params.set('group', group)
  else params.delete('group')
  if (category) params.set('category', category)
  else params.delete('category')
  const qs = params.toString()
  const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
  window.history.replaceState({}, '', next)
}

export function TokenExplorer({ dataset, title }: Props) {
  const initial = readUrlParams()
  const [query, setQuery] = useState(initial.q)
  const [debouncedQuery, setDebouncedQuery] = useState(initial.q)
  const [groupFilter, setGroupFilter] = useState(initial.group)
  const [categoryFilter, setCategoryFilter] = useState(initial.category)
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [toast, setToast] = useState('')
  const parentRef = useRef<HTMLDivElement>(null)

  const rows = useMemo(() => {
    switch (dataset) {
      case 'semantic-colors':
        return SEMANTIC_TOKENS as Row[]
      case 'color-primitives':
        return COLOR_PRIMITIVES as Row[]
      case 'size':
        return SIZE_TOKENS as Row[]
      case 'effects':
        return EFFECTS_TOKENS as Row[]
    }
  }, [dataset])

  const groups = useMemo(() => {
    if (dataset === 'semantic-colors') {
      return SEMANTIC_GROUPS.map(([g]) => g)
    }
    const palettes = new Set<string>()
    for (const row of rows as SimpleTokenRow[]) {
      palettes.add(row.palette)
    }
    return Array.from(palettes).sort()
  }, [dataset, rows])

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 200)
    return () => window.clearTimeout(t)
  }, [query])

  useEffect(() => {
    writeUrlParams(debouncedQuery, groupFilter, categoryFilter)
  }, [debouncedQuery, groupFilter, categoryFilter])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return rows.filter((row) => {
      const groupKey = isSemantic(row) ? row.group : (row as SimpleTokenRow).palette
      if (groupFilter && groupKey !== groupFilter) return false
      if (categoryFilter && dataset === 'semantic-colors' && topCategory(row.group) !== categoryFilter) {
        return false
      }
      if (!q) return true
      const haystack = [
        row.token,
        groupKey,
        isSemantic(row) ? row.light : (row as SimpleTokenRow).value,
        isSemantic(row) ? row.dark : '',
        isSemantic(row) ? row.lightStep : (row as SimpleTokenRow).step,
        isSemantic(row) ? row.darkStep : '',
        figmaToCssVar(row.token),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, debouncedQuery, groupFilter, categoryFilter, dataset])

  const rowHeight = density === 'compact' ? 44 : 56
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 12,
  })

  const showCopied = useCallback(() => {
    setToast('Copied')
    window.setTimeout(() => setToast(''), 1500)
  }, [])

  const clearFilters = () => {
    setQuery('')
    setDebouncedQuery('')
    setGroupFilter('')
    setCategoryFilter('')
  }

  const figmaLink =
    dataset === 'semantic-colors'
      ? FIGMA_LINKS.semanticTable
      : dataset === 'color-primitives'
        ? FIGMA_LINKS.primitivesTable
        : dataset === 'size'
          ? FIGMA_LINKS.sizeTable
          : FIGMA_LINKS.effectsTable

  const countLabel = TOKEN_META.counts[dataset]

  return (
    <div className="vds-ref vds-explorer">
      {dataset === 'semantic-colors' && (
        <p className="callout callout--warning vds-explorer__disclaimer">
          Dark column values come from Figma <strong>Dark Mode Testing</strong>. Production dark mode is still in
          validation.
        </p>
      )}

      <div className="vds-ref__toolbar vds-explorer__toolbar">
        <input
          className="vds-input"
          type="search"
          placeholder="Search token, group, hex, step…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tokens"
        />
        <select
          className="vds-select"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          aria-label="Filter by group"
        >
          <option value="">All groups</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="vds-explorer__toolbar-actions">
          <button
            type="button"
            className="vds-density-btn"
            onClick={() => setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'))}
          >
            {density === 'comfortable' ? 'Compact' : 'Comfortable'}
          </button>
          <span className="vds-count">
            {filtered.length} / {countLabel}
          </span>
        </div>
      </div>

      {dataset === 'semantic-colors' && (
        <div className="vds-explorer__categories">
          <button
            type="button"
            className={`vds-chip${categoryFilter === '' ? ' vds-chip--active' : ''}`}
            onClick={() => setCategoryFilter('')}
          >
            All
          </button>
          {TOP_CATEGORIES.map(([cat, n]) => (
            <button
              key={cat}
              type="button"
              className={`vds-chip${categoryFilter === cat ? ' vds-chip--active' : ''}`}
              onClick={() => setCategoryFilter(cat === categoryFilter ? '' : cat)}
            >
              {cat} ({n})
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="vds-empty vds-explorer__empty">
          No tokens match.{' '}
          <button type="button" className="vds-link-btn" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="vds-table-wrap vds-explorer__table-wrap">
          <div
            className={`vds-explorer__header-row${dataset !== 'semantic-colors' ? ' vds-explorer__header-row--simple' : ''}`}
          >
            {dataset === 'semantic-colors' && <span className="vds-explorer__col vds-explorer__col--group">Group</span>}
            {dataset !== 'semantic-colors' && (
              <span className="vds-explorer__col vds-explorer__col--group">Palette</span>
            )}
            <span className="vds-explorer__col vds-explorer__col--token">Token</span>
            {dataset === 'semantic-colors' ? (
              <>
                <span className="vds-explorer__col vds-explorer__col--value">Light</span>
                <span className="vds-explorer__col vds-explorer__col--value">Dark</span>
                <span className="vds-explorer__col vds-explorer__col--step">Step</span>
              </>
            ) : (
              <>
                <span className="vds-explorer__col vds-explorer__col--value">Value</span>
                <span className="vds-explorer__col vds-explorer__col--step">Step</span>
              </>
            )}
            <span className="vds-explorer__col vds-explorer__col--copy">Copy</span>
          </div>
          <div ref={parentRef} className="vds-explorer__scroll" style={{ height: Math.min(560, filtered.length * rowHeight + 8) }}>
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map((vRow) => {
                const row = filtered[vRow.index]
                const groupKey = isSemantic(row) ? row.group : (row as SimpleTokenRow).palette
                const lightHex = isSemantic(row) ? row.light : (row as SimpleTokenRow).value

                return (
                  <div
                    key={row.token}
                    className={`vds-explorer__row${dataset !== 'semantic-colors' ? ' vds-explorer__row--simple' : ''}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: vRow.size,
                      transform: `translateY(${vRow.start}px)`,
                    }}
                  >
                    <span className="vds-explorer__col vds-explorer__col--group vds-group-cell">{groupKey}</span>
                    <span className="vds-explorer__col vds-explorer__col--token">
                      <code className="vds-token-code">{row.token}</code>
                    </span>
                    {isSemantic(row) ? (
                      <>
                        <span className="vds-explorer__col vds-explorer__col--value">
                          <div className="vds-value-cell">
                            <Swatch value={row.light} />
                            <span className="vds-value-cell__hex">{row.light ?? '—'}</span>
                          </div>
                        </span>
                        <span className="vds-explorer__col vds-explorer__col--value">
                          <div className="vds-value-cell">
                            <Swatch value={row.dark} />
                            <span className="vds-value-cell__hex">{row.dark ?? '—'}</span>
                          </div>
                        </span>
                        <span className="vds-explorer__col vds-explorer__col--step vds-muted">
                          {row.lightStep ?? '—'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="vds-explorer__col vds-explorer__col--value">
                          <div className="vds-value-cell">
                            <Swatch value={(row as SimpleTokenRow).value} />
                            <span className="vds-value-cell__hex">{(row as SimpleTokenRow).value ?? '—'}</span>
                          </div>
                        </span>
                        <span className="vds-explorer__col vds-explorer__col--step vds-muted">
                          {(row as SimpleTokenRow).step ?? '—'}
                        </span>
                      </>
                    )}
                    <span className="vds-explorer__col vds-explorer__col--copy">
                      <div className="vds-copy-group">
                        <CopyButton label="Name" value={row.token} onCopied={showCopied} />
                        {isHex(lightHex) && (
                          <>
                            <CopyButton label="Hex" value={lightHex} onCopied={showCopied} />
                            <CopyButton
                              label="CSS"
                              value={cssDeclaration(row.token, lightHex)}
                              onCopied={showCopied}
                            />
                          </>
                        )}
                      </div>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="vds-toast" role="status">{toast}</div>}

      <p className="vds-explorer__footer">
        Source: Figma Collection ·{' '}
        <a href={figmaLink} target="_blank" rel="noopener noreferrer">
          Open in Figma
        </a>
        {' · '}
        <a href={FIGMA_LINKS.collection} target="_blank" rel="noopener noreferrer">
          Full Collection
        </a>
      </p>
    </div>
  )
}

export function explorerSearchHref(tokenFragment: string): string {
  return `?path=/docs/reference-semantic-colors--docs&q=${encodeURIComponent(tokenFragment)}`
}
