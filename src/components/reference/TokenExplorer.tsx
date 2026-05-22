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
import { SortHeader } from './SortHeader'
import {
  defaultPrimitiveSort,
  defaultSemanticSort,
  defaultSimpleSort,
  nextSortDirection,
  sortSemanticRows,
  sortSimpleRows,
  type SortDirection,
} from './sort-utils'

export type TokenDataset = 'semantic-colors' | 'color-primitives' | 'size' | 'effects'

type Props = {
  dataset: TokenDataset
  title?: string
}

const SEMANTIC_VISIBLE_ROWS = 24
const DEFAULT_VISIBLE_ROWS = 10
const FIGMA_WORKFLOW_DOC = '?path=/docs/migrations-color-v2-figma-workflow--docs'

type Row = SemanticTokenRow | SimpleTokenRow

function isSemantic(row: Row): row is SemanticTokenRow {
  return 'light' in row
}

function initialSort(dataset: TokenDataset): { column: string; direction: SortDirection } {
  switch (dataset) {
    case 'color-primitives':
      return defaultPrimitiveSort()
    case 'semantic-colors':
      return defaultSemanticSort()
    default:
      return defaultSimpleSort()
  }
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

export function TokenExplorer({ dataset }: Props) {
  const initial = readUrlParams()
  const defaultSort = initialSort(dataset)
  const [query, setQuery] = useState(initial.q)
  const [debouncedQuery, setDebouncedQuery] = useState(initial.q)
  const [groupFilter, setGroupFilter] = useState(initial.group)
  const [categoryFilter, setCategoryFilter] = useState(initial.category)
  const [sortColumn, setSortColumn] = useState(defaultSort.column)
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort.direction)
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

  const visibleGroups = useMemo(() => {
    if (dataset !== 'semantic-colors' || !categoryFilter) return groups
    return groups.filter((g) => topCategory(g) === categoryFilter)
  }, [groups, categoryFilter, dataset])

  const sortedCategories = useMemo(
    () => [...TOP_CATEGORIES].sort((a, b) => a[0].localeCompare(b[0])),
    [],
  )

  // Heal stale URLs where a category name (e.g. "scheduler") was stored as group=
  useEffect(() => {
    if (dataset !== 'semantic-colors') return
    if (groupFilter && !groups.includes(groupFilter)) {
      const isCategory = TOP_CATEGORIES.some(([cat]) => cat === groupFilter)
      if (isCategory && !categoryFilter) {
        setCategoryFilter(groupFilter)
      }
      setGroupFilter('')
    }
  }, [dataset, groups, groupFilter, categoryFilter])

  // If group falls outside selected category, reset it
  useEffect(() => {
    if (dataset !== 'semantic-colors' || !categoryFilter || !groupFilter) return
    if (topCategory(groupFilter) !== categoryFilter) {
      setGroupFilter('')
    }
  }, [dataset, categoryFilter, groupFilter])

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(query), 200)
    return () => window.clearTimeout(t)
  }, [query])

  useEffect(() => {
    writeUrlParams(debouncedQuery, groupFilter, categoryFilter)
  }, [debouncedQuery, groupFilter, categoryFilter])

  useEffect(() => {
    parentRef.current?.scrollTo({ top: 0 })
  }, [sortColumn, sortDirection])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    return rows.filter((row) => {
      const groupKey = isSemantic(row) ? row.group : (row as SimpleTokenRow).palette
      if (groupFilter && groupKey !== groupFilter) return false
      if (
        categoryFilter &&
        dataset === 'semantic-colors' &&
        isSemantic(row) &&
        topCategory(row.group) !== categoryFilter
      ) {
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

  const sorted = useMemo(() => {
    if (dataset === 'semantic-colors') {
      return sortSemanticRows(filtered as SemanticTokenRow[], sortColumn, sortDirection)
    }
    const simpleDataset = dataset === 'color-primitives' ? 'color-primitives' : dataset
    return sortSimpleRows(filtered as SimpleTokenRow[], sortColumn, sortDirection, simpleDataset)
  }, [filtered, sortColumn, sortDirection, dataset])

  const rowHeight = density === 'compact' ? 44 : 56
  const maxVisibleRows = dataset === 'semantic-colors' ? SEMANTIC_VISIBLE_ROWS : DEFAULT_VISIBLE_ROWS
  const scrollHeight = Math.min(sorted.length, maxVisibleRows) * rowHeight + 8
  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: dataset === 'semantic-colors' ? 20 : 12,
  })

  const showCopied = useCallback(() => {
    setToast('Copied')
    window.setTimeout(() => setToast(''), 1500)
  }, [])

  const handleSort = (column: string) => {
    setSortDirection((prev) => nextSortDirection(sortColumn, prev, column))
    setSortColumn(column)
  }

  const handleSortPreset = (column: string) => {
    setSortColumn(column)
    setSortDirection('asc')
  }

  const clearFilters = () => {
    setQuery('')
    setDebouncedQuery('')
    setGroupFilter('')
    setCategoryFilter('')
    const reset = initialSort(dataset)
    setSortColumn(reset.column)
    setSortDirection(reset.direction)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
    setGroupFilter('')
  }

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = []
    if (debouncedQuery.trim()) labels.push(`search: "${debouncedQuery.trim()}"`)
    if (categoryFilter) labels.push(`category: ${categoryFilter}`)
    if (groupFilter) labels.push(`${paletteFilterLabel}: ${groupFilter}`)
    return labels
  }, [debouncedQuery, categoryFilter, groupFilter, paletteFilterLabel])

  const figmaLink =
    dataset === 'semantic-colors'
      ? FIGMA_LINKS.semanticTable
      : dataset === 'color-primitives'
        ? FIGMA_LINKS.primitivesTable
        : dataset === 'size'
          ? FIGMA_LINKS.sizeTable
          : FIGMA_LINKS.effectsTable

  const countLabel = TOKEN_META.counts[dataset]
  const isSemanticTable = dataset === 'semantic-colors'
  const isPrimitives = dataset === 'color-primitives'
  const isSimple = !isSemanticTable
  const rowLayoutClass = isPrimitives
    ? ' vds-explorer__row--primitives'
    : isSimple
      ? ' vds-explorer__row--simple'
      : ''
  const headerLayoutClass = isPrimitives
    ? ' vds-explorer__header-row--primitives'
    : isSimple
      ? ' vds-explorer__header-row--simple'
      : ''
  const paletteFilterLabel = isPrimitives ? 'palette' : 'group'

  return (
    <div className="vds-ref vds-explorer">
      {dataset === 'semantic-colors' && (
        <p className="callout callout--warning vds-explorer__disclaimer">
          Dark column values come from Figma <strong>Dark Mode Testing</strong>. Production dark mode is still in
          validation.
        </p>
      )}

      {dataset === 'semantic-colors' ? (
        <p className="vds-explorer__source">
          <a href={figmaLink} target="_blank" rel="noopener noreferrer">
            Open semantic table in Figma
          </a>
          {' · '}
          <a href={FIGMA_LINKS.collection} target="_blank" rel="noopener noreferrer">
            Full Collection
          </a>
          {' · '}
          <a href={FIGMA_WORKFLOW_DOC}>Figma Workflow guide</a>
        </p>
      ) : null}

      <div
        className={`vds-ref__toolbar vds-explorer__toolbar${
          dataset === 'color-primitives'
            ? ' vds-explorer__toolbar--with-sort'
            : dataset === 'semantic-colors'
              ? ' vds-explorer__toolbar--semantic'
              : ''
        }`}
      >
        <input
          className="vds-input"
          type="search"
          placeholder="Search token, group, hex, step…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search tokens"
        />
        {dataset === 'semantic-colors' && (
          <select
            className="vds-select"
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {sortedCategories.map(([cat, n]) => (
              <option key={cat} value={cat}>
                {cat} ({n})
              </option>
            ))}
          </select>
        )}
        <select
          className="vds-select"
          value={groups.includes(groupFilter) || groupFilter === '' ? groupFilter : ''}
          onChange={(e) => setGroupFilter(e.target.value)}
          aria-label={
            dataset === 'semantic-colors'
              ? 'Filter by Figma group'
              : isPrimitives
                ? 'Filter by palette'
                : 'Filter by group'
          }
        >
          <option value="">
            {dataset === 'semantic-colors'
              ? 'All groups'
              : isPrimitives
                ? 'All palettes'
                : 'All groups'}
          </option>
          {visibleGroups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {dataset === 'color-primitives' && (
          <select
            className="vds-select"
            value={sortColumn}
            onChange={(e) => handleSortPreset(e.target.value)}
            aria-label="Sort order"
          >
            <option value="gradation">Gradation (default)</option>
            <option value="palette">Palette</option>
            <option value="token">Token name</option>
            <option value="value">Hex value</option>
            <option value="step">Step</option>
          </select>
        )}
        <div className="vds-explorer__toolbar-actions">
          <button
            type="button"
            className="vds-density-btn"
            onClick={() => setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'))}
          >
            {density === 'comfortable' ? 'Compact' : 'Comfortable'}
          </button>
          <span className="vds-count">
            {sorted.length} / {countLabel}
          </span>
        </div>
      </div>

      {activeFilterLabels.length > 0 && (
        <div className="vds-explorer__active-filters">
          <span className="vds-explorer__active-filters-label">Active filters:</span>
          {activeFilterLabels.map((label) => (
            <span key={label} className="vds-explorer__filter-tag">
              {label}
            </span>
          ))}
          <button type="button" className="vds-link-btn" onClick={clearFilters}>
            Clear all
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="vds-empty vds-explorer__empty">
          No tokens match
          {activeFilterLabels.length > 0 ? ` (${activeFilterLabels.join(' · ')})` : ''}.{' '}
          <button type="button" className="vds-link-btn" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="vds-table-wrap vds-explorer__table-wrap">
          <div className={`vds-explorer__header-row${headerLayoutClass}`}>
            {dataset === 'semantic-colors' ? (
              <SortHeader
                label="Group"
                column="group"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                className="vds-explorer__col vds-explorer__col--group"
              />
            ) : !isPrimitives ? (
              <SortHeader
                label="Palette"
                column="palette"
                activeColumn={sortColumn}
                direction={sortDirection}
                onSort={handleSort}
                className="vds-explorer__col vds-explorer__col--group"
              />
            ) : null}
            <SortHeader
              label="Token"
              column="token"
              activeColumn={sortColumn}
              direction={sortDirection}
              onSort={handleSort}
              className="vds-explorer__col vds-explorer__col--token"
            />
            {dataset === 'semantic-colors' ? (
              <>
                <SortHeader
                  label="Light"
                  column="light"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="vds-explorer__col vds-explorer__col--value"
                />
                <SortHeader
                  label="Dark"
                  column="dark"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="vds-explorer__col vds-explorer__col--value"
                />
                <SortHeader
                  label="Step"
                  column="step"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="vds-explorer__col vds-explorer__col--step"
                />
              </>
            ) : (
              <>
                <SortHeader
                  label="Value"
                  column="value"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="vds-explorer__col vds-explorer__col--value"
                />
                <SortHeader
                  label="Step"
                  column="step"
                  activeColumn={sortColumn}
                  direction={sortDirection}
                  onSort={handleSort}
                  className="vds-explorer__col vds-explorer__col--step"
                />
              </>
            )}
            <span className="vds-explorer__col vds-explorer__col--copy">Copy</span>
          </div>
          <div
            ref={parentRef}
            className="vds-explorer__scroll"
            style={{ height: scrollHeight }}
          >
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map((vRow) => {
                const row = sorted[vRow.index]
                const groupKey = isSemantic(row) ? row.group : (row as SimpleTokenRow).palette
                const lightHex = isSemantic(row) ? row.light : (row as SimpleTokenRow).value
                const darkHex = isSemantic(row) ? row.dark : null

                return (
                  <div
                    key={row.token}
                    className={`vds-explorer__row${rowLayoutClass}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: vRow.size,
                      transform: `translateY(${vRow.start}px)`,
                    }}
                  >
                    {!isPrimitives && (
                      <span className="vds-explorer__col vds-explorer__col--group vds-group-cell">{groupKey}</span>
                    )}
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
                          {dataset === 'color-primitives'
                            ? (row as SimpleTokenRow).token.split('/').pop()
                            : ((row as SimpleTokenRow).step ?? '—')}
                        </span>
                      </>
                    )}
                    <span className="vds-explorer__col vds-explorer__col--copy">
                      <div className="vds-copy-group">
                        <CopyButton label="Name" value={row.token} onCopied={showCopied} />
                        {isHex(lightHex) && (
                          <>
                            <CopyButton
                              label={isSemantic(row) ? 'Light' : 'Hex'}
                              value={lightHex}
                              onCopied={showCopied}
                            />
                            {isHex(darkHex) && (
                              <CopyButton label="Dark" value={darkHex} onCopied={showCopied} />
                            )}
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

      {dataset !== 'semantic-colors' && (
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
      )}
    </div>
  )
}

export function explorerSearchHref(tokenFragment: string): string {
  return `?path=/docs/reference-semantic-colors--docs&q=${encodeURIComponent(tokenFragment)}`
}
