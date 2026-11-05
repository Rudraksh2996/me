# ThreeUI source provenance

Fetched 2026-11-05 from https://threeui.com/source-code/kibori-landing-page.json. The bundle supplies inline code for the component and shared CSS, but **no embedded HTML copy**: its HTML entry only supplies a sourceUrl and stale metadata. That sourceUrl resolves to https://threeui.com/landing-pages/kibori.html. Two independent canonical downloads had identical bytes and hash.

Upstream source changed after the prompt was written. The user explicitly authorized the current canonical HTML, then authorized following the bundle's sourceUrl despite its stale hash. No claim is made that the current HTML matches the stale bundle digest.

Pristine inputs are retained byte-for-byte in vendor/threeui; the portfolio HTML is generated separately. Git attributes disable newline conversion for pristine inputs and assets.

| File | Originally expected SHA-256 (also bundle metadata) | Actual SHA-256 used |
| --- | --- | --- |
| KiboriLandingPage.tsx | `0983b92f333f22eb2799f437ff1b71121b6c398285c3249451618d2ff7298bd4` | `0983b92f333f22eb2799f437ff1b71121b6c398285c3249451618d2ff7298bd4` |
| kibori.html | `81d3014c0d164775817d6f77b0641199f3ccc5d7d10f861e1d9192a7a0c7cf8e` | `409e541be1ada6f3e99ef0cb8b990550cd2b2dd01a3452753c28b1c954245c38` |
| threeui.css | `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf` | `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf` |

The current HTML is 1,160,839 bytes; bundle metadata reports 1,158,749 bytes. Component and CSS still match their original hashes.

## Adapted application files

The table above identifies the pristine inputs. The application uses these derived versions; deliberate changes are listed in DEVIATIONS.md.

| File | Original expected SHA-256 | Final SHA-256 used |
| --- | --- | --- |
| `public/landing-pages/kibori.html` (generated) | `81d3014c0d164775817d6f77b0641199f3ccc5d7d10f861e1d9192a7a0c7cf8e` | `0754dddf30fe9b9bcac5ec0bbdf32b2ac88e17b694e2a72d45d7cef570c9fce6` |
| `src/shaders/kibori-landing-page/KiboriLandingPage.tsx` | `0983b92f333f22eb2799f437ff1b71121b6c398285c3249451618d2ff7298bd4` | `27c915981fc6f310ed62645a334ed6629eb4164e16a79052dd5e88dbc34f1720` |
| `vendor/threeui/threeui.css` (imported unchanged) | `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf` | `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf` |

These final hashes are also recorded by the build in generated-source.json. The baseline HTML hash remains the explicitly authorized `409e541b…5c38`; content adaptation accounts for the generated HTML's different hash.

## Registered assets

All 17 files match both the original prompt and registered metadata, including byte lengths.

| Path | Bytes | Expected and actual SHA-256 |
| --- | ---: | --- |
| public/landing-pages/kibori-assets/290e6267dd833bf5.woff2 | 11604 | `290e6267dd833bf5f899eba4c29ad0a9b09dbe53f6075b18af38057159e1ff20` |
| public/landing-pages/kibori-assets/3fdae1011669e390.woff2 | 11764 | `3fdae1011669e390ea55e782040804de1778292af1471d6fabc72533bdfbfe2b` |
| public/landing-pages/kibori-assets/547ad9fdaeb0ae43.woff2 | 4972 | `547ad9fdaeb0ae43487f4b8a02e47c36553c0c0cb73c8aa98f93b7b615f6b55d` |
| public/landing-pages/kibori-assets/5a51946dfffa8297.woff2 | 22128 | `5a51946dfffa82972bc98745359c46761515641fda557c25116459a9f83da4a7` |
| public/landing-pages/kibori-assets/5eb09b5ac0e28b67.woff2 | 21032 | `5eb09b5ac0e28b67c2f041c8ba6d244604ca0c0980d65912ab2d47fed84ddc31` |
| public/landing-pages/kibori-assets/6744a7f509ebc6ab.woff2 | 35000 | `6744a7f509ebc6ab220a6cd4ea77e898adf014f03d88dcda5d45d8a9feefb4e9` |
| public/landing-pages/kibori-assets/8909904ab6c872eb.woff2 | 23664 | `8909904ab6c872eb994093482a88a28eca2cd95912d7b6fecd72103b0dc07edc` |
| public/landing-pages/kibori-assets/art-0.svg | 250 | `9b391d7968fc2a17e563ba2e58507299d47f4c890b9c4de686a3e8fe8b2dfd84` |
| public/landing-pages/kibori-assets/art-1.svg | 306 | `59a3146ba987dac112122ed92595ebea408547ce40972c7d05985e589bae878d` |
| public/landing-pages/kibori-assets/art-2.svg | 305 | `ca98f43d601fb0f2f63da9ce5a0bf62a9a41273ea806a3f047783620c8b33ceb` |
| public/landing-pages/kibori-assets/c15ddd00a9927b56.woff2 | 7776 | `c15ddd00a9927b56f5c655a41f976f79bd848a20cce91fc14227751872a1cc27` |
| public/landing-pages/kibori-assets/d0014821252a8a77.woff2 | 12384 | `d0014821252a8a770bf7551641572f239a8ede83d75652d84fef0c3627751baf` |
| public/landing-pages/kibori-assets/eadedd9e13c25824.woff2 | 5264 | `eadedd9e13c2582430a9fb1519eb86152fdabb483a6f66d90f8d8a52e977a1b7` |
| public/landing-pages/kibori-assets/ef572f9187a8be01.woff2 | 10232 | `ef572f9187a8be018d9d9c2c6b77c1f6cb2af4199f02fc16c292ea10ab25a2cc` |
| public/landing-pages/kibori-assets/f0bb586459ce8f09.woff2 | 7712 | `f0bb586459ce8f09b238285040f17e3e9e9538b2c5a7aae0775194e33c36c3c3` |
| public/landing-pages/kibori-assets/kibori-atelier-seal-v2.webp | 199154 | `9632d913de9cae7ff0868e7a483fbd4cd919a539c840e5f8541a74935fb5136c` |
| public/landing-pages/kibori-assets/kibori-workshop-print-v2.webp | 1631460 | `dc88d8a5843d37abb762101b03b054bb92e81629b258b6749062173836f3e8b5` |

Run `npm run verify:source` to verify every pristine input and asset again. The generated HTML hash is emitted by `npm run build` and recorded in docs/generated-source.json.

## Dependencies and licensing

The scene imports Three.js 0.169.0, now served locally from that exact npm dependency. The canonical HTML contains its authored physics implementation and all shader/scene code; no substitute scene or external ThreeUI documentation is embedded. React hosts the registered iframe component. The published @designcodeio/threeui@1.2.0 tarball was inspected and contains no Kibori HTML, so it is not a dependency.

Preserve upstream attribution. The source bundle does not supply a separate license grant; use remains subject to the user ThreeUI rights. No additional permission or ownership is asserted.
