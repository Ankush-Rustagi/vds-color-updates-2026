import type { SemanticTokenRow, SimpleTokenRow } from '../../tokens/collection'
import type { TokenDataset } from './TokenExplorer'

const FONT_SANS_11 = '11px system-ui, sans-serif'
const FONT_SANS_12 = '12px system-ui, sans-serif'
const FONT_HEADER = '600 11px system-ui, sans-serif'

/** 24px swatch + 2px border + 12px flex gap */
const SWATCH_AND_GAP = 38
const CELL_PAD = 12
const VALUE_H_PAD = 24
const VALUE_COL_BUFFER = 8
const GRID_GAP = 12
const ROW_PADDING = 24

/** Conservative per-char width when DOM/canvas is unavailable (#FFFFFF00). */
const MONO_CHAR_PX = 9.5

let measureCanvas: HTMLCanvasElement | null = null
let measureHexEl: HTMLSpanElement | null = null

function measureMonoHex(text: string): number {
  if (!text) return 0

  if (typeof document !== 'undefined') {
    measureHexEl ??= document.createElement('span')
    measureHexEl.className = 'vds-value-cell__hex'
    measureHexEl.style.position = 'absolute'
    measureHexEl.style.visibility = 'hidden'
    measureHexEl.style.pointerEvents = 'none'
    measureHexEl.style.whiteSpace = 'nowrap'
    measureHexEl.textContent = text
    document.body.appendChild(measureHexEl)
    const width = Math.ceil(measureHexEl.getBoundingClientRect().width)
    document.body.removeChild(measureHexEl)
    return width
  }

  return Math.ceil(text.length * MONO_CHAR_PX)
}

function measureTextPx(text: string, font: string): number {
  if (!text) return 0
  if (typeof document === 'undefined') return Math.ceil(text.length * 7)

  measureCanvas ??= document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return Math.ceil(text.length * 7)

  // Canvas font does not parse CSS fallback lists; use a single family.
  ctx.font = font.includes('monospace') ? '12px monospace' : font
  return ctx.measureText(text).width
}

function columnWidth(
  values: string[],
  font: string,
  {
    min = 40,
    max = 640,
    pad = CELL_PAD,
    extra = 0,
    mono = false,
  }: { min?: number; max?: number; pad?: number; extra?: number; mono?: boolean } = {},
): number {
  let widestPx = 0
  for (const value of values) {
    const px = mono ? measureMonoHex(value) : measureTextPx(value, font)
    if (px > widestPx) widestPx = px
  }
  const measured = Math.ceil(widestPx) + extra + pad
  return Math.min(max, Math.max(min, measured))
}

function fixedTrack(width: number): string {
  return `minmax(${width}px, ${width}px)`
}

function valueColumnWidth(values: string[], min = 108): number {
  return (
    columnWidth(values, '12px monospace', {
      min,
      extra: SWATCH_AND_GAP,
      pad: VALUE_H_PAD,
      mono: true,
    }) + VALUE_COL_BUFFER
  )
}

function copyColumnWidth(semantic: boolean): number {
  const labels = semantic ? ['Name', 'Light', 'Dark', 'CSS'] : ['Name', 'Hex', 'CSS']
  let total = CELL_PAD
  for (const label of labels) {
    total += Math.ceil(measureTextPx(label, FONT_SANS_11)) + 16 + 2
  }
  total += (labels.length - 1) * 4
  return total
}

function primitiveStep(row: SimpleTokenRow): string {
  return row.token.split('/').pop() ?? '—'
}

function simpleStep(row: SimpleTokenRow, dataset: TokenDataset): string {
  if (dataset === 'color-primitives') return primitiveStep(row)
  return row.step ?? '—'
}

function parseTrackWidths(gridColumns: string): number[] {
  return [...gridColumns.matchAll(/minmax\((\d+)px,\s*\1px\)/g)].map((match) => Number(match[1]))
}

/** Sum of fixed tracks + inter-column gaps + row horizontal padding. */
export function computeExplorerGridMinWidth(gridColumns: string): number {
  const tracks = parseTrackWidths(gridColumns)
  if (tracks.length === 0) return 0
  return tracks.reduce((sum, width) => sum + width, 0) + (tracks.length - 1) * GRID_GAP + ROW_PADDING
}

export type ExplorerGridLayout = {
  columns: string
  minWidth: number
}

/** Grid columns sized from the full dataset so widths stay stable while filtering. */
export function computeExplorerGridLayout(
  dataset: TokenDataset,
  rows: Array<SemanticTokenRow | SimpleTokenRow>,
): ExplorerGridLayout {
  const columns = computeExplorerGridColumns(dataset, rows)
  return { columns, minWidth: computeExplorerGridMinWidth(columns) }
}

/** Grid columns sized from the full dataset so widths stay stable while filtering. */
export function computeExplorerGridColumns(
  dataset: TokenDataset,
  rows: Array<SemanticTokenRow | SimpleTokenRow>,
): string {
  const sample = rows.length > 0 ? rows : []

  if (dataset === 'semantic-colors') {
    const semantic = sample as SemanticTokenRow[]
    const tokenW = columnWidth(
      [...semantic.map((r) => r.token), 'Token'],
      '12px monospace',
      { min: 120, max: 520, mono: true },
    )
    const lightW = valueColumnWidth([...semantic.map((r) => r.light ?? '—'), 'Light'])
    const darkW = valueColumnWidth([...semantic.map((r) => r.dark ?? '—'), 'Dark'])
    const stepW = columnWidth(
      [...semantic.map((r) => String(r.lightStep ?? '—')), 'Step'],
      FONT_SANS_12,
      { min: 48 },
    )
    const copyW = copyColumnWidth(true)

    return [
      fixedTrack(tokenW),
      fixedTrack(lightW),
      fixedTrack(darkW),
      fixedTrack(stepW),
      fixedTrack(copyW),
    ].join(' ')
  }

  if (dataset === 'color-primitives') {
    const simple = sample as SimpleTokenRow[]
    const tokenW = columnWidth(
      [...simple.map((r) => r.token), 'Token'],
      '12px monospace',
      { min: 120, max: 480, mono: true },
    )
    const valueW = valueColumnWidth([...simple.map((r) => r.value ?? '—'), 'Value'])
    const stepW = columnWidth(
      [...simple.map((r) => primitiveStep(r)), 'Step'],
      FONT_SANS_12,
      { min: 48 },
    )
    const copyW = copyColumnWidth(false)

    return [
      fixedTrack(tokenW),
      fixedTrack(valueW),
      fixedTrack(stepW),
      fixedTrack(copyW),
    ].join(' ')
  }

  // size + effects
  const simple = sample as SimpleTokenRow[]
  const paletteW = columnWidth(
    [...simple.map((r) => r.palette), 'Palette'],
    FONT_SANS_12,
    { min: 72, max: 200 },
  )
  const tokenW = columnWidth(
    [...simple.map((r) => r.token), 'Token'],
    '12px monospace',
    { min: 100, max: 360, mono: true },
  )
  const valueW =
    dataset === 'effects'
      ? valueColumnWidth([...simple.map((r) => r.value ?? '—'), 'Value'], 72)
      : columnWidth([...simple.map((r) => r.value ?? '—'), 'Value'], FONT_SANS_12, { min: 72 })
  const stepW = columnWidth(
    [...simple.map((r) => simpleStep(r, dataset)), 'Step'],
    FONT_SANS_12,
    { min: 44 },
  )
  const copyW = copyColumnWidth(false)

  return [
    fixedTrack(paletteW),
    fixedTrack(tokenW),
    fixedTrack(valueW),
    fixedTrack(stepW),
    fixedTrack(copyW),
  ].join(' ')
}

export { GRID_GAP, measureTextPx, FONT_HEADER }
