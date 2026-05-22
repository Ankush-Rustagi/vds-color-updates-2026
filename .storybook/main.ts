import type { StorybookConfig } from '@storybook/react-vite'

/** GitHub Pages project site: https://ankush-rustagi.github.io/vds-color-updates-2026/ */
export const GITHUB_PAGES_BASE = '/vds-color-updates-2026/'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  viteFinal: async (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      config.base = GITHUB_PAGES_BASE
      config.build = {
        ...config.build,
        // Single CSS bundle avoids preload 404s when chunk hashes drift between deploys.
        cssCodeSplit: false,
      }
    }
    return config
  },
}

export default config
