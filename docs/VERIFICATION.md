# Verification — 2026-11-05

## Source integrity

- Fresh JSON bundle obtained from the requested URL. It contains no inline HTML; its sourceUrl points to the canonical HTML. The canonical HTML was independently fetched twice and both downloads match the user-authorized `409e541be1ada6f3e99ef0cb8b990550cd2b2dd01a3452753c28b1c954245c38`.
- TSX and shared CSS match their originally expected hashes. Every one of the 17 registered assets matches the original expected SHA-256 and byte length.
- `npm run verify:source` passes on every dev/build invocation. Exact source tables are in SOURCE.md; generated/adapted file hashes are in generated-source.json.

## Checks

- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm run build` — pass, including source/asset verification.
- `npm audit` — zero vulnerabilities after overriding the lint tooling's minimatch dependency to its patched 11.x version. Runtime dependency audit is also clean.
- `git diff --check` — pass.
- HTTP 200 for both the React shell and the generated iframe document on the local preview.

## Browser checks

Tested in the real Codex in-app Chromium browser at 1280×800, 1600×900, and 390×844.

- Authored animated fire loader, intro reveal, lighting, and 3D woodshop render.
- All eight desktop index entries clicked, with each corresponding chapter becoming visible and showing the correct project copy.
- Craft picking/inspection opens the original 3D inspector. “Explore craft” was checked on desktop and mobile. Arrow-key input, Escape close, and return of focus to “Explore craft” were verified. The source's return animation must finish before focus is restored.
- Both desktop and mobile project layouts inspected visually. Mobile hero, long captions, metadata, project actions, and paper finale fit the viewport.
- Get in touch reveals the paper finale; the inner paper scroll reaches the projects/skills/education/certification index. Real repository, social, email, phone, and resume URLs are present.
- Empty contact submission displays the name/email validation message. The wrapper's final sandbox includes allow-forms so the form event can run; the handler prevents network submission. No email was sent.
- The original reduced-motion branches remain intact in the source. This browser tool does not expose media emulation, so reduced-motion mode was inspected in code rather than toggled in the browser.

## Limits and warnings

- No public deployment was created. The local preview is http://127.0.0.1:5173/; Vercel deployment steps and required headers are in README.md.
- The authored scene has a substantial shader warm-up and can take minutes in an embedded/software-rendered browser. Warm-up eventually completed, and all eight chapters rendered. No scene/shader simplification was introduced.
- No JavaScript errors observed. The GPU driver emitted an upstream Three.js shader compiler warning X3595 about derivatives in a varying loop; rendering continued. Shaders were retained as requested.
- Vite warns about `fonts/fragment-mono.woff2` referenced by an unrelated component in the exact shared ThreeUI stylesheet. Kibori uses the verified Instrument Serif, Inter, and Shippori Mincho assets; no missing font request or font error was observed in its browser session.
- The mailto handoff depends on a configured email application. No external email was sent during testing.
- Production hosting, mobile touch on physical hardware, and performance benchmarks were not tested. Mobile testing used an actual browser viewport override.
