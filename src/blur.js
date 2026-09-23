/**
 * Blur layer for the GitHub Zed themes.
 *
 * Ported from jenslys/zed-catppuccin-blur, but computed from each GitHub
 * theme's own tokens instead of hard-coded per-variant hex values, so it
 * works for every GitHub variant (light/dark, colorblind, tritanopia, ...).
 */

const TRANSPARENT = '#00000000'

/**
 * Blur intensity levels - higher alpha = less transparency / more opaque.
 * - main:     window chrome (background, title bar, status bar)
 * - surface:  surface panels
 * - elements: scrollbar thumbs and hover/selected states
 * - active:   active tab, drop target
 * - control:  `border`, i.e. checkbox/input outlines and tab underlines. Zed
 *             draws these at 1px and sometimes at 60% opacity on top, so they
 *             need a high alpha to stay visible.
 * - seam:     pane/group borders, the ones that should stay nearly invisible
 *             so split panes read as one blurred surface.
 */
export const BLUR_LEVELS = {
  light: { main: '99', surface: '8c', elements: '80', active: '90', control: '80', seam: '20' },
  medium: { main: 'd7', surface: 'd0', elements: 'a0', active: 'b0', control: '98', seam: '25' },
  heavy: { main: 'e0', surface: 'db', elements: 'c0', active: 'd0', control: 'b4', seam: '30' },
}

/**
 * @typedef {keyof typeof BLUR_LEVELS} BlurLevel
 */

/**
 * Replace (or append) the alpha channel of a hex color.
 * @param {string | undefined} color `#rrggbb` or `#rrggbbaa`
 * @param {string} alpha two hex digits
 */
function withAlpha(color, alpha) {
  if (!color) return undefined
  const hex = color.replace('#', '').slice(0, 6)
  return `#${hex}${alpha}`
}

/**
 * Apply the blur overrides to a single generated theme.
 * @param {ReturnType<import('./theme.js').getTheme>} theme
 * @param {BlurLevel} level
 */
export function applyBlur(theme, level) {
  const blur = BLUR_LEVELS[level]
  const style = theme.style

  // Base colors taken from the theme itself, so every GitHub variant keeps
  // its own palette.
  const background = style['background']
  const inset = style['surface.background']
  const border = style['border']
  const accent = style['text.accent']
  const thumb = style['scrollbar.thumb.background']
  const elevated = style['elevated_surface.background']

  return {
    ...theme,
    style: {
      ...style,

      'background.appearance': 'blurred',

      // Window chrome: translucent, tinted with the theme background.
      background: withAlpha(background, blur.main),
      'status_bar.background': withAlpha(background, blur.main),
      'title_bar.background': withAlpha(background, blur.main),
      'surface.background': withAlpha(inset, blur.surface),

      // Popovers / overlays stay opaque so text on top of them is readable.
      'elevated_surface.background': withAlpha(elevated, 'ff'),
      'panel.overlay_background': withAlpha(elevated, 'ff'),

      // Everything painted inside the window is see-through, so the blurred
      // window background (and the wallpaper behind it) shows through.
      'editor.background': TRANSPARENT,
      'editor.gutter.background': TRANSPARENT,
      'editor.active_line.background': TRANSPARENT,
      'panel.background': TRANSPARENT,
      'tab_bar.background': TRANSPARENT,
      'tab.inactive_background': TRANSPARENT,
      'terminal.background': TRANSPARENT,
      'toolbar.background': TRANSPARENT,
      'element.active': TRANSPARENT,
      'panel.focused_border': TRANSPARENT,
      'scrollbar.track.background': TRANSPARENT,
      'scrollbar.track.border': TRANSPARENT,

      // `border` also draws checkbox outlines and the git panel's inactive tab
      // underline, so it stays strong. Only the pane seams are faded out, which
      // is what makes split panes read as one blurred surface.
      border: withAlpha(border, blur.control),
      'border.variant': withAlpha(border, blur.seam),
      'pane_group.border': withAlpha(border, blur.seam),
      'pane.focused_border': withAlpha(border, blur.seam),

      'tab.active_background': withAlpha(inset, blur.active),
      'scrollbar.thumb.background': withAlpha(thumb, blur.elements),
      'hint.background': withAlpha(inset, 'c0'),

      // Ghost buttons keep fixed alphas across levels so they stay legible.
      'ghost_element.background': withAlpha(inset, '60'),
      'ghost_element.hover': withAlpha(inset, '90'),
      'ghost_element.active': withAlpha(accent, '30'),
      'ghost_element.selected': withAlpha(accent, '50'),
      'drop_target.background': withAlpha(accent, blur.active),
    },
  }
}
