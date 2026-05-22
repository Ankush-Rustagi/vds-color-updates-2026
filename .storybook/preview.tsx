import type { Preview } from '@storybook/react'
import '../src/styles/global.css'
import '../src/tokens/vds-tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'VDS Color v2 migration guides. Start with Introduction → Platform Strategy.',
      },
      toc: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          ['Platform Strategy', 'Rollout Phases', 'Who Does What'],
          'Foundations',
          ['Color v2', ['Overview', "What's Changing", 'Accessibility', 'Greenfield Adoption']],
          'Reference',
          ['Token Naming', 'Semantic Colors', 'Color Primitives', 'Size', 'Effects'],
          'Teams',
          ['Overview', '*'],
          'Migrations',
          ['Color v2', ['Getting Started', 'Figma Workflow', 'Token Mapping', 'Alert Button', 'Checkbox']],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light or dark mode preview',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light'
      return (
        <div data-theme={theme} className="sb-preview-root">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
