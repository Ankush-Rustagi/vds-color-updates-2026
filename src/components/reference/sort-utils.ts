import type { SemanticTokenRow, SimpleTokenRow } from '../../tokens/collection'
import { isHex } from '../../tokens/collection'

export type SortDirection = 'asc' | 'desc'

export type PrimitiveSortPreset = 'gradation' | 'palette' | 'token' | 'value' | 'step'
export type SemanticSortPreset = 'token' | 'light' | 'dark' | 'step'

/** Numeric step from token suffix, e.g. `--color-primitives/cyan/100` → 100 */
export function parsePrimitiveStep(token: string): number {
  const suffix = token.split('/').pop() ?? ''
  if (/^\d+$/.test(suffix)) return parseInt(suffix, 10)
  const named: Record<string, number> = {
    transparent: -1,
    'blue-muted': 500,
    'off-black': 9990,
    'true-black': 10000,
  }
  return named[suffix] ?? 9999
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

function compareNullableStrings(a?: string | null, b?: string | null): number {
  return compareStrings(a ?? '', b ?? '')
}

function compareNumericStrings(a?: string | null, b?: string | null): number {
  const na = parseFloat(a ?? '')
  const nb = parseFloat(b ?? '')
  if (!Number.isNaN(na) && !Number.isNaN(nb) && a !== b) return na - nb
  return compareNullableStrings(a, b)
}

function compareHex(a?: string | null, b?: string | null): number {
  if (!isHex(a) || !isHex(b)) return compareNullableStrings(a, b)
  return compareStrings(a, b)
}

function applyDirection(cmp: number, direction: SortDirection): number {
  return direction === 'asc' ? cmp : -cmp
}

export function compareColorPrimitivesGradation(a: SimpleTokenRow, b: SimpleTokenRow): number {
  const paletteCmp = compareStrings(a.palette, b.palette)
  if (paletteCmp !== 0) return paletteCmp
  return parsePrimitiveStep(a.token) - parsePrimitiveStep(b.token)
}

/** Numeric step from Figma lightStep, e.g. `600`, `transparent`. */
export function parseSemanticStep(step?: string | null): number {
  if (!step) return 9999
  if (step === 'transparent') return -1
  if (/^\d+$/.test(step)) return parseInt(step, 10)
  return 9999
}

export function sortSemanticRows(
  rows: SemanticTokenRow[],
  column: string,
  direction: SortDirection,
): SemanticTokenRow[] {
  const sorted = [...rows].sort((a, b) => {
    let cmp = 0
    switch (column) {
      case 'token':
        cmp = compareStrings(a.token, b.token)
        break
      case 'light':
        cmp = compareHex(a.light, b.light)
        break
      case 'dark':
        cmp = compareHex(a.dark, b.dark)
        break
      case 'step': {
        const stepCmp = parseSemanticStep(a.lightStep) - parseSemanticStep(b.lightStep)
        cmp = stepCmp !== 0 ? stepCmp : compareStrings(a.token, b.token)
        break
      }
      default:
        cmp = compareStrings(a.token, b.token)
    }
    return applyDirection(cmp, direction)
  })
  return sorted
}

export function sortSimpleRows(
  rows: SimpleTokenRow[],
  column: string,
  direction: SortDirection,
  dataset: 'color-primitives' | 'size' | 'effects',
): SimpleTokenRow[] {
  const sorted = [...rows].sort((a, b) => {
    let cmp = 0
    switch (column) {
      case 'gradation':
        cmp = compareColorPrimitivesGradation(a, b)
        break
      case 'palette':
        cmp = compareStrings(a.palette, b.palette)
        break
      case 'token':
        cmp = compareStrings(a.token, b.token)
        break
      case 'value':
        cmp =
          dataset === 'size'
            ? compareNumericStrings(a.value, b.value)
            : compareHex(a.value, b.value) || compareNullableStrings(a.value, b.value)
        break
      case 'step':
        cmp =
          dataset === 'color-primitives'
            ? parsePrimitiveStep(a.token) - parsePrimitiveStep(b.token)
            : compareNullableStrings(a.step, b.step)
        break
      default:
        cmp =
          dataset === 'color-primitives'
            ? compareColorPrimitivesGradation(a, b)
            : compareStrings(a.palette, b.palette) || compareStrings(a.token, b.token)
    }
    return applyDirection(cmp, direction)
  })
  return sorted
}

export function defaultPrimitiveSort(): { column: 'gradation'; direction: 'asc' } {
  return { column: 'gradation', direction: 'asc' }
}

export function defaultSemanticSort(): { column: 'token'; direction: 'asc' } {
  return { column: 'token', direction: 'asc' }
}

export function defaultSimpleSort(): { column: 'palette'; direction: 'asc' } {
  return { column: 'palette', direction: 'asc' }
}

export function nextSortDirection(
  currentColumn: string | null,
  currentDirection: SortDirection,
  clickedColumn: string,
): SortDirection {
  if (currentColumn !== clickedColumn) return 'asc'
  return currentDirection === 'asc' ? 'desc' : 'asc'
}
