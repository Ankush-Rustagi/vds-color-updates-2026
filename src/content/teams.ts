import type { TokenMapping } from './token-mappings'

export type ProductTeam = {
  id: string
  name: string
  surface: string
  example: string
  mapping: TokenMapping
  status: 'example-ready' | 'in-progress' | 'not-started'
  designOwner: string
  engOwner: string
}

export const PRODUCT_TEAMS: ProductTeam[] = [
  {
    id: 'cameras',
    name: 'Cameras',
    surface: 'Camera grid, live view chrome, device health badges',
    example: 'Status pill colors on camera tiles',
    mapping: { legacy: '--color-text-secondary', v2: '--text/secondary' },
    status: 'not-started',
    designOwner: 'VDS + Cameras design',
    engOwner: 'Web Platform',
  },
  {
    id: 'access-control',
    name: 'Access Control',
    surface: 'Door reader panels, lock state indicators, credential modals',
    example: 'Alert button on forced-door events',
    mapping: { legacy: '--button-danger-bg', v2: '--button/background/alert' },
    status: 'not-started',
    designOwner: 'AC design',
    engOwner: 'Access Control eng',
  },
  {
    id: 'alarms',
    name: 'Alarms',
    surface: 'Incident banners, zone status, arming controls',
    example: 'Critical alert banner background',
    mapping: { legacy: '--bg-alert', v2: '--background/alert' },
    status: 'not-started',
    designOwner: 'Alarms design',
    engOwner: 'Alarms eng',
  },
  {
    id: 'intercom',
    name: 'Intercom',
    surface: 'Call UI, directory search, door release buttons',
    example: 'Primary action button on call panel',
    mapping: { legacy: '--button-primary-bg', v2: '--button/background/primary' },
    status: 'not-started',
    designOwner: 'Intercom design',
    engOwner: 'Intercom eng',
  },
  {
    id: 'centers',
    name: 'Centers',
    surface: 'Sensor reading cards, threshold alerts, trend charts',
    example: 'Warning state on CO2 threshold breach',
    mapping: { legacy: '--color-warning', v2: '--support/warning' },
    status: 'not-started',
    designOwner: 'Centers design',
    engOwner: 'Centers eng',
  },
  {
    id: 'workplace',
    name: 'Workplace',
    surface: 'Visitor check-in, badge printing, host notifications',
    example: 'Checkbox on visitor consent form',
    mapping: { legacy: '--checkbox-bg', v2: '--checkbox/default-background' },
    status: 'not-started',
    designOwner: 'Workplace design',
    engOwner: 'Workplace eng',
  },
  {
    id: 'maps',
    name: 'Maps',
    surface: 'Site hierarchy, floor overlays, device pins',
    example: 'Surface background on map sidebar',
    mapping: { legacy: '--bg-canvas', v2: '--background/surface-01' },
    status: 'in-progress',
    designOwner: 'Maps design',
    engOwner: 'Maps eng',
  },
]
