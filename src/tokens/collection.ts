import semanticData from './generated/semantic-colors.json'
import primitivesData from './generated/color-primitives.json'
import sizeData from './generated/size.json'
import effectsData from './generated/effects.json'
import meta from './generated/meta.json'

export type SemanticTokenRow = (typeof semanticData.rows)[number]
export type SimpleTokenRow = (typeof primitivesData.rows)[number]

export const SEMANTIC_TOKENS = semanticData.rows as SemanticTokenRow[]
export const COLOR_PRIMITIVES = primitivesData.rows as SimpleTokenRow[]
export const SIZE_TOKENS = sizeData.rows as SimpleTokenRow[]
export const EFFECTS_TOKENS = effectsData.rows as SimpleTokenRow[]
export const TOKEN_META = meta

export const SEMANTIC_GROUPS = Object.entries(meta.semanticGroups as Record<string, number>).sort(
  (a, b) => b[1] - a[1],
)

export const TOP_CATEGORIES = Object.entries(meta.topCategories as Record<string, number>).sort(
  (a, b) => b[1] - a[1],
)

export function isHex(value?: string | null): value is string {
  return !!value && /^#[0-9A-Fa-f]{6,8}$/.test(value)
}
