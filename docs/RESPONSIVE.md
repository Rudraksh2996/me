# Responsive refinement — 2026-11-05

The portfolio adapts continuously between breakpoints rather than depending on a list of device models. No finite test can certify every screen in existence; the representative browser matrix covers 240–3440 CSS pixels wide, portrait and landscape, and heights from 320–1440 CSS pixels.

## Changes

- Fluid title sizes are bounded by both viewport width and height. Long chapter copy wraps within the available reading area.
- Short displays use a scrollable chapter region, keeping project links and craft controls reachable when all copy cannot fit at once.
- Navigation, footer, and inspector account for device safe-area insets. Compact headers hide nonessential issue/decorative labels.
- Project actions and inspector Close have 44px minimum targets; form inputs use 16px text to avoid mobile focus zoom. Coarse-pointer footer links receive more spacing.
- Under 400px, contact form fields and contact details stack into one column. Tablet details use two columns; larger layouts use four.
- The inspector has a viewport-bounded width, wrapping controls, and bounded note scrolling on short screens.
- The React shell uses 100vh as a fallback and 100dvh where available, with no outer scrolling competing with the scene iframe.
- Orientation/window resizing preserves normalized story progress. Glyph measurements refresh for height-only changes, preventing stale masks after resizing.
- Original 3D framing, shaders, adaptive render-resolution caps, fire transitions, and reduced-motion behavior remain intact.

## Browser measurements

`responsive-matrix.json` records measured element bounds at these actual browser viewport sizes:

240×320, 320×568, 390×844, 540×720, 768×1024, 568×320, 667×375, 844×390, 1024×600, 1024×768, 1280×720, 1920×1080, 2560×1440, and 3440×1440.

All measured viewports had no document horizontal overflow. Hero branding, header brand/contact action, and the paper's horizontal extent fit within the viewport. The short-height cases enable vertical copy scrolling. Compact and landscape scenes were also inspected visually and interacted with in the real browser.

The final 240px header was rechecked after hiding decorative chrome: its scroll width equals the 240px viewport. Rotation from 240×320 to 844×390 retained chapter 0; normalized scroll progress changed only from 0.05581986 to 0.05579846 (layout rounding). Glyphs and chapter copy reflowed correctly in the landscape layout.

These are viewport simulations in Chromium, not physical-device tests. Safe-area and coarse-pointer rules are present but cannot be fully verified without the corresponding hardware/browser environment. Browser zoom and OS text-scale combinations are not exhaustively certified. The original scene's substantial first-load shader warm-up and upstream nonfatal shader compiler warning remain.
