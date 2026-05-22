export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function topCategory(group: string): string {
  return group.split('/')[0] || group
}

/** Figma `--button/background/alert` → CSS `--vds-button-background-alert` */
export function figmaToCssVar(figmaToken: string): string {
  const stripped = figmaToken.replace(/^--/, '')
  return `--vds-${stripped.replace(/\//g, '-').toLowerCase()}`
}

export function cssDeclaration(figmaToken: string, hex: string): string {
  return `${figmaToCssVar(figmaToken)}: ${hex.toLowerCase()};`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
