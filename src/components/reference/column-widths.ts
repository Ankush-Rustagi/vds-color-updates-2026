import type { SemanticTokenRow, SimpleTokenRow } from '../../tokens/collection'
import type { TokenDataset } from './TokenExplorer'

const FONT_MONO_12 = '12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
const FONT_SANS_11 = '11px system-ui, -apple-system, Segoe UI, sans-serif'
const FONT_SANS_12 = '12px system-ui, -apple-system, Segoe UI, sans-serif'
const FONT_HEADER = '600 11px system-ui, -apple-system, Segoe UI, sans-serif'

const SWATCH_AND_GAP = 34 // 24px swatch + 10px gap
const CELL_PAD = 12
const GRID_GAP = 8

let measureCanvas: HTMLCanvasElement | null = null

function measureTextPx(text: string, font: string): number {
  if (!text) return 0
  if (typeof document === 'undefined') return text.length * 7
  measureCanvas ??= document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return text.length * 7
  ctx.font = font
  return ctx.measureText(text).width
}

function columnWidth(
  values: string[],
  font: string,
  { min = 40, max = 640, pad = CELL_PAD, extra = 0 }: { min?: number; max?: number; pad?: number; extra?: number } = {},
): number {
  let widest = ''
  let widestPx = 0
  for (const value of values) {
    const px = measureTextPx(value, font)
    if (px > widestPx) {
      widestPx = px
      widest = value
    }
  }
  const measured = Math.ceil(widestPx) + extra + pad
  return Math.min(max, Math.max(min, measured))
}

function fixedTrack(width: number): string {
  return `minmax(${width}px, ${width}px)`
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
      FONT_MONO_12,
      { min: 120, max: 520 },
    )
    const lightW = columnWidth(
      [...semantic.map((r) => r.light ?? '—'), 'Light'],
      FONT_MONO_12,
      { min: 88, extra: SWATCH_AND_GAP },
    )
    const darkW = columnWidth(
      [...semantic.map((r) => r.dark ?? '—'), 'Dark'],
      FONT_MONO_12,
      { min: 88, extra: SWATCH_AND_GAP },
    )
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
      FONT_MONO_12,
      { min: 120, max: 480 },
    )
    const valueW = columnWidth(
      [...simple.map((r) => r.value ?? '—'), 'Value'],
      FONT_MONO_12,
      { min: 88, extra: SWATCH_AND_GAP },
    )
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
    FONT_MONO_12,
    { min: 100, max: 360 },
  )
  const valueW = columnWidth(
    [...simple.map((r) => r.value ?? '—'), 'Value'],
    FONT_MONO_12,
    { min: 72, extra: dataset === 'effects' ? SWATCH_AND_GAP : 0 },
  )
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
