# Kindling/startup optimization — 2026-11-11

## Problem and change

The original startup built the scene, then awaited `prepareWorkshop()` before starting the normal frame loop. That function compiled materials for the entire workshop and rendered three poses at each of eight stations into two scene targets: **48 off-screen scene renders**, plus post-processing/inspection shader preparation.

The generated portfolio now uses on-demand startup by default. It builds the authored scene, starts the real frame loop, and lets Three.js compile the materials that actual rendered frames need. The original fire loader and reveal remain; the loader is not simply hidden on a timer before the scene is ready. No shader, geometry, pixel-ratio cap, or multisampling setting was reduced.

The source change is isolated in `scripts/startup-adapter.mjs`. The pristine vendor HTML and all registered asset bytes remain unchanged and continue to pass verification.

## Local comparison

Production output was served with `npm run preview -- --port 4173` and measured in the same local embedded Chromium browser at 1280×720. Each mode was loaded as the scene document itself, with no interaction during loading. The full warm-up mode ran first; the optimized mode ran second. Browser/GPU caches were not cleared between runs, so these are illustrative local observations, not a controlled cold-cache benchmark or a cross-device performance guarantee.

| Phase | Full-workshop preparation | On-demand startup |
| --- | ---: | ---: |
| Scene build / initial resource work | 46,755 ms | 41,916 ms |
| Explicit all-workshop prewarm | 113,703 ms | 0 ms |
| First real frames and loader handoff | 2,040 ms | 19,869 ms |
| Total scene-script start to loader removal | **162,498 ms** | **61,784 ms** |

The observed total fell by **100,714 ms**, approximately **62%**. The separate phase measurements show the intended tradeoff: mandatory full-workshop preparation disappears from entry, while some shader work moves into the first real frames. Scene construction still took roughly 42 seconds on this test machine; this change does not promise an instant opening on every device.

Individual phases are rounded independently, so their displayed sum can differ from the rounded total by a millisecond. Raw observations and measurement caveats are retained in `startup-benchmark.json`.

A separate final production-host check at 390×844 measured 60,683 ms total (36,276 ms scene construction, 0 ms explicit prewarm, and 24,406 ms first-frame/handoff work). This also ran after the earlier browser work and is not a cold-cache mobile-device benchmark.

## First-use tradeoff

Later craft materials, shadow variants, or effects can compile when first visited, so a first chapter transition or inspection can hitch. Compilation delays were encountered during local first-use navigation. This optimization prioritizes reaching the landing page without preparing every future scene in advance; it does not claim that all later compilation costs have been eliminated.

The original complete-workshop preparation remains available for comparison/recovery at the **scene document** URL with `?warmup=full`:

```text
http://127.0.0.1:4173/landing-pages/kibori.html?warmup=full
```

The normal URL omits the query:

```text
http://127.0.0.1:4173/landing-pages/kibori.html
```

The React host uses a fixed iframe source. A query added only to the outer application URL is not forwarded to that iframe.

## Measurement implementation

An early inline script records `portfolio:start`. The scene records marks after construction and immediately before the first real frame. A short-lived mutation observer records `portfolio:ready` when the actual loader is removed, only after rendering boot has been reached. It then disconnects.

After readiness, inspect the scene document's `document.documentElement.dataset.startupTiming` for JSON containing:

- `mode`: `full` or `on-demand`.
- `sceneBuildMs`: early scene script to completed scene construction.
- `prewarmMs`: optional full-workshop preparation.
- `firstFrameAndRevealMs`: first-frame start through loader removal.
- `totalMs`: early scene script through loader removal.

This is local diagnostic state, not analytics. No timing data is transmitted or persisted by the application. It excludes time before the early inline script, such as the initial request/React-shell navigation. It is not an FCP/LCP measurement, and loader removal can precede the end of the authored reveal animation.

## Asset reuse

The React host now also retains its iframe when the document becomes hidden. Returning from another browser tab therefore does not intentionally rebuild the whole scene or replay kindling. Intersection-based unmounting, full reloads, and browser context loss are distinct cases and can still require reconstruction. Browser-managed hidden-frame throttling replaces the previous document-visibility unmount.

`vercel.json` adds `Cache-Control: public, max-age=31536000, immutable` only for `/landing-pages/kibori-assets/*`. Those 17 assets are verified and unchanged. A changed asset must use a new URL or an intentional cache-invalidation plan; do not replace bytes behind an immutable cached URL silently.

HTML and the unversioned Three.js module are not given this immutable policy. The existing CORS configuration remains. Vite preview does not apply Vercel's deployment headers, so repeat-visit cache behavior on production was not claimed as locally verified.

## Regression checks

`npm run test:startup` runs seven Node tests covering normal entry without all-station preparation, the explicit blocking comparison mode, recovery from a comparison warm-up failure, source-anchor changes, preventing readiness diagnostics from firing before rendering boot/loader removal, and visible/hidden host rendering. The host tests transpile the actual component with the existing TypeScript dependency and assert that its iframe is present for both document-visibility states.

The normal build still verifies original source/assets and type-checks the application. Browser checks are required in addition to these tests because Node tests do not render or benchmark GPU work.

All eight chapter index entries were visited after the on-demand opening. The later crafts rendered, and craft inspection, arrow-key input, and Escape were checked. No JavaScript errors were observed. The final React iframe host was also checked at 390×844 and rendered the landing page with the loader removed. The existing upstream shader compiler warning remained.

A separate in-app tab was opened and closed: the loaded iframe/timing record remained and kindling did not restart. That environment continued to report `document.hidden=false`, so this does not certify a real hidden-document transition; visible/hidden component rendering is additionally covered by the two host regression tests.
