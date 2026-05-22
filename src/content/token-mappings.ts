export type TokenMapping = {
  legacy: string
  v2: string
  notes?: string
}

/** Common Command / Verity legacy dialect mappings (curated, not exhaustive). */
export const TOKEN_MAPPINGS: TokenMapping[] = [
  { legacy: '--bg-canvas', v2: '--background/surface-01', notes: 'Page background' },
  { legacy: '--color-surface-default', v2: '--background/surface-02', notes: 'Card / panel background' },
  { legacy: '--color-text-primary', v2: '--text/primary', notes: 'Body text' },
  { legacy: '--color-text-secondary', v2: '--text/secondary', notes: 'Supporting text' },
  { legacy: '--fg-primary', v2: '--text/emphasis', notes: 'High emphasis text' },
  { legacy: '--button-danger-bg', v2: '--button/background/alert', notes: 'Destructive actions' },
  { legacy: '--button-danger-hover', v2: '--button/background/alert-hover', notes: 'Destructive hover' },
  { legacy: '--button-primary-bg', v2: '--button/background/primary', notes: 'Primary CTA' },
  { legacy: '--bg-alert', v2: '--banner/inline/alert-background', notes: 'Alert banner background' },
  { legacy: '--color-warning', v2: '--support/warning', notes: 'Warning indicators' },
  { legacy: '--checkbox-bg', v2: '--checkbox/default-background', notes: 'Checkbox fill' },
  { legacy: '--checkbox-border', v2: '--checkbox/default-border', notes: 'Checkbox border' },
  { legacy: '--focus-ring', v2: '--border/focus-ring', notes: 'Focus outline (brand cyan)' },
  { legacy: '--vc-axis-label', v2: '--text/secondary', notes: 'Chart axis labels (Verity charts)' },
  { legacy: '--vc-grid-line', v2: '--border/subtle-01', notes: 'Chart grid lines' },
  { legacy: '--vc-series-1', v2: '--icon/content/brand', notes: 'Chart series color (use product chart palette where defined)' },
  { legacy: '--vs-badge-bg', v2: '--badges/muted/grey-background', notes: 'Status badge background' },
  { legacy: '--vd-link-text', v2: '--link/shape/primary', notes: 'Inline links' },
  { legacy: '--color-border-default', v2: '--border/subtle-01', notes: 'Standard borders' },
  { legacy: '--color-border-focus', v2: '--border/focus-ring', notes: 'Focused input borders' },
  { legacy: '--text-disabled', v2: '--text/disabled', notes: 'Disabled label text' },
  { legacy: '--button-disabled-bg', v2: '--button/background/alert-disabled', notes: 'Disabled alert button fill' },
  { legacy: '--surface-elevated', v2: '--background/elevated-on-surface', notes: 'Cards, dropdowns, modals' },
  { legacy: '--icon-primary', v2: '--icon/content/primary', notes: 'Default icon color' },
  { legacy: '--icon-secondary', v2: '--icon/content/secondary', notes: 'Secondary icons' },
]
