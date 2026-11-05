# Rudraksh Sharma — Kibori portfolio

A personal portfolio built on the registered ThreeUI Kibori experience: a cinematic woodshop, eight interactive crafts, fire transitions, and a paper contact finale. Eight chapters explore three documented software projects: GuardAuth, Expense Tracker, and Zru Studios. Woodcrafts are illustrative; no extra projects are invented.

## Stack

Vite, React, TypeScript, Three.js 0.169.0, authored HTML/CSS/JavaScript and shaders. The registered source is used directly; `@designcodeio/threeui@1.2.0` does not contain Kibori and is not installed. The embedded physics implementation is supplied by the canonical source.

## Run locally

Use Node.js 22.12+ (tested with 24.16) and npm.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite (normally http://127.0.0.1:5173/). A WebGL2-capable browser is required. The original scene builds and warms many GPU programs during its fire loader; first load may take time, especially in an embedded browser or on a software GPU.

```sh
npm run verify:source
npm run lint
npm run typecheck
npm run build
npm run preview
```

The production app is in `dist/`, which is intentionally ignored. Build scripts verify pristine source and every registered asset before generating the adapted HTML. Never edit the generated `public/landing-pages/kibori.html` directly.

## Content and source

- Edit `src/portfolio-data.json` for all personal/project data.
- `scripts/prepare-portfolio.mjs` contains the isolated adaptation, with guarded source anchors.
- `vendor/threeui/` retains exact fetched inputs.
- [Source hashes and upstream change](docs/SOURCE.md)
- [Content provenance and gaps](docs/CONTENT.md)
- [Every source deviation](docs/DEVIATIONS.md)
- [Verification results](docs/VERIFICATION.md)

Pinned revision unavailable; current canonical source used with user authorization. The JSON bundle contains inline TSX/CSS and a canonical HTML URL, but its HTML hash is stale. All 17 original asset hashes match.

## Controls

Scroll through the chapters; Projects jumps to the first project. The authored index shows all chapters on large screens and the current chapter at narrower widths. About / Skills and Get in touch reveal the paper finale. Each project links to its real repository. Explore craft lifts the authored 3D object; drag or use arrow keys to turn it, and use Close/Escape to return. Keyboard focus is visible. The source's reduced-motion mode is retained.

The contact form opens a mailto draft in the visitor's configured email app. It never sends automatically and has no backend. Email and social links work independently of the form. Source resume is the unchanged historical PDF from the original Portfolio repository.

## Deploy with Vercel

Import https://github.com/Rudraksh2996/me in Vercel, choose the Vite preset, use `npm run build`, and set output to `dist`. The included vercel.json supplies those settings and the CORS header required by the sandboxed scene. No environment variables or secrets are required. Configure an absolute Open Graph image URL in both metadata locations after assigning a public domain if your sharing platform requires one. Do not add a catch-all SPA rewrite: the iframe HTML must be served as its own document.

For another static host, serve all of dist at the origin root and send `Access-Control-Allow-Origin: *` for `/landing-pages/*`. GitHub Pages project subpaths require updating the component's absolute iframe path, root resume/favicon/OG paths, and Vite base first; Vercel avoids that extra configuration.

## History and recovery

The previous site is preserved on `backup/pre-rewrite` at `c6bc0a9002adcc2bd80e36cba1d314c1ea6e7266`. The first rewrite commit removes the legacy files separately. Recover by checking out that backup branch or reverting the rewrite commits; no force push is needed.

Respect ThreeUI source licensing and the original portfolio's content ownership. No new redistribution license is asserted for the upstream artwork or code.
