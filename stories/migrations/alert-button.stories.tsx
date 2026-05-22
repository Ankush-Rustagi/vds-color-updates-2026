import type { Meta, StoryObj } from '@storybook/react'
import { AlertButton, AlertButtonRow } from '../../src/components/migration/AlertButton'
import { BeforeAfter } from '../../src/components/migration/BeforeAfter'

const meta: Meta<typeof AlertButton> = {
  title: 'Color v2 Migrations/Alert Button',
  component: AlertButton,
  parameters: {
    docs: {
      description: {
        component:
          'Destructive action button migration from legacy `--button-danger-bg` to `--button/background/alert`. Reference: Color Updates slide 6.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof AlertButton>

export const BeforeAfterWhite: Story = {
  name: 'Before/After on white',
  render: () => (
    <BeforeAfter
      before={<AlertButtonRow tokenVariant="legacy" background="canvas" />}
      after={<AlertButtonRow tokenVariant="v2" background="canvas" />}
    />
  ),
}

export const BeforeAfterSurface01: Story = {
  name: 'Before/After on surface-01',
  render: () => (
    <BeforeAfter
      before={<AlertButtonRow tokenVariant="legacy" background="surface-01" />}
      after={<AlertButtonRow tokenVariant="v2" background="surface-01" />}
    />
  ),
}

export const Default: Story = {
  args: {
    tokenVariant: 'v2',
    state: 'default',
    children: 'Delete',
  },
}
