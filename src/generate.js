import fs from 'node:fs/promises'
import { getTheme } from './theme.js'
import { applyBlur } from './blur.js'

/**
 * Blur level used for the published themes: 'light' | 'medium' | 'heavy'.
 * See BLUR_LEVELS in ./blur.js.
 */
const BLUR_LEVEL = 'medium'

/** @type {Array<{ themeKey: import('./tokens.js').ThemeKey, name: string, type: 'light' | 'dark' }>} */
const variants = [
  { themeKey: 'light', name: 'GitHub Light Blur', type: 'light' },
  { themeKey: 'light_colorblind', name: 'GitHub Light Colorblind Blur', type: 'light' },
  { themeKey: 'light_high_contrast', name: 'GitHub Light High Contrast Blur', type: 'light' },
  { themeKey: 'light_tritanopia', name: 'GitHub Light Tritanopia Blur', type: 'light' },
  { themeKey: 'dark', name: 'GitHub Dark Blur', type: 'dark' },
  { themeKey: 'dark_colorblind', name: 'GitHub Dark Colorblind Blur', type: 'dark' },
  { themeKey: 'dark_high_contrast', name: 'GitHub Dark High Contrast Blur', type: 'dark' },
  { themeKey: 'dark_tritanopia', name: 'GitHub Dark Tritanopia Blur', type: 'dark' },
  { themeKey: 'dark_dimmed', name: 'GitHub Dark Dimmed Blur', type: 'dark' },
]

const writeData = {
  $schema: 'https://zed.dev/schema/themes/v0.1.0.json',
  name: 'GitHub Blur',
  author: 'Pyae Sone Aung, Santiago Bandiera',
  themes: variants.map((variant) => applyBlur(getTheme(variant), BLUR_LEVEL)),
}

await fs.mkdir('./themes', { recursive: true })

await fs.writeFile('./themes/github_blur.json', JSON.stringify(writeData, null, 2))
