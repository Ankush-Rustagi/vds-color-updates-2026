import type { Preview } from '@storybook/react'
import '../src/styles/global.css'
import '../src/tokens/vds-tokens.css'

const preview: Preview = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'VDS Color v2 migration guides. Strategy hub: https://ankush-rustagi.github.io/vds-color-v2/',
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
          'Foundations',
          ['Color v2', ['Overview', "What's Changing", 'Accessibility', 'Greenfield Adoption']],
          'Migrations',
          ['Color v2', ['Getting Started', 'Figma Workflow', 'Token Mapping', 'Alert Button', 'Checkbox']],
          'Teams',
          ['Overview', '*'],
          'Reference',
          ['Token Naming', 'Semantic Colors', 'Color Primitives', 'Size', 'Effects'],
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
