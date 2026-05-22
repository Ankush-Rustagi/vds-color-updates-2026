import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox, CheckboxMatrix } from '../../src/components/migration/Checkbox'
import { BeforeAfter } from '../../src/components/migration/BeforeAfter'

const meta: Meta<typeof Checkbox> = {
  title: 'Migrations/Color v2/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox migration from legacy vars to `--checkbox/*` semantic tokens. Reference: Color Updates slides 8–9.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const BeforeAfterMatrix: Story = {
  name: 'Before/After matrix',
  render: () => (
    <BeforeAfter
      before={<CheckboxMatrix tokenVariant="legacy" />}
      after={<CheckboxMatrix tokenVariant="v2" />}
    />
  ),
}

export const Default: Story = {
  args: {
    tokenVariant: 'v2',
    visual: 'selected',
    state: 'default',
  },
}
