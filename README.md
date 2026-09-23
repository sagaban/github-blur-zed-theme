# GitHub Blur — Zed theme

The [GitHub theme for Zed](https://github.com/PyaeSoneAungRgn/github-zed-theme) with the
translucent / blurred backgrounds from [zed-catppuccin-blur](https://github.com/jenslys/zed-catppuccin-blur).

All nine GitHub variants are included:

| | |
|---|---|
| GitHub Light Blur | GitHub Dark Blur |
| GitHub Light Colorblind Blur | GitHub Dark Colorblind Blur |
| GitHub Light High Contrast Blur | GitHub Dark High Contrast Blur |
| GitHub Light Tritanopia Blur | GitHub Dark Tritanopia Blur |
| | GitHub Dark Dimmed Blur |

## Install

Install as a dev extension:

1. Zed → `zed: install dev extension` (command palette)
2. Pick this directory
3. `theme selector: toggle` → choose a `... Blur` theme

The blur only shows through if the window itself is translucent. Add to your Zed settings:

```json
{
  "window_background_appearance": "blurred"
}
```

(`"transparent"` also works if you want no blur behind the window.)

## Build

```sh
npm install
npm run build   # regenerates themes/github_blur.json
```

Colors come from `@primer/primitives` via `src/tokens.js` / `src/theme.js` (unchanged from
upstream). `src/blur.js` is the only added layer: it takes a generated GitHub theme and
rewrites the background-ish keys — window chrome gets an alpha channel, everything painted
inside the window (editor, gutter, panels, tab bar, terminal, toolbar) becomes fully
transparent, and pane seams are softened.

Note that `border` itself is *not* softened: Zed draws checkbox outlines and the git panel's
inactive-tab underline with it, so fading it out makes those controls invisible. Only
`border.variant`, `pane_group.border` and `pane.focused_border` are faded.

`src/theme.js` carries two small fixes over upstream: `text.muted` pointed at
`fgColor/default` (making muted text indistinguishable from normal text, e.g. the inactive
git panel tab) and `icon.placeholder` had a typo'd token name.

Unlike the Catppuccin version, the overrides are computed from each theme's own tokens
rather than hard-coded per variant, so every GitHub variant is covered automatically.

### Blur intensity

`BLUR_LEVEL` in `src/generate.js` selects `light` / `medium` / `heavy` from `BLUR_LEVELS`
in `src/blur.js` (default: `medium`, ~85% opaque chrome). Change it and re-run `npm run build`.

Each level defines: `main` (window chrome), `surface`, `elements` (scrollbar thumb, hover),
`active` (active tab, drop target), `control` (`border` — control outlines) and `seam`
(pane borders).

## Credits

- [PyaeSoneAungRgn/github-zed-theme](https://github.com/PyaeSoneAungRgn/github-zed-theme) — colors
- [jenslys/zed-catppuccin-blur](https://github.com/jenslys/zed-catppuccin-blur) — blur approach
