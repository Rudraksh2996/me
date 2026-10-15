// Hand-drawn SVG layers for the cinematic scenes. Each layer is its own element so
// GSAP can move them at independent rates (parallax depth).

// Deterministic PRNG so server and client render identical markup.
export function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
const r2 = (n: number) => Math.round(n * 100) / 100;

type Pt = [number, number];
type Seg = [Pt, Pt, Pt, Pt];

const bez = (t: number, a: number, b: number, c: number, d: number) =>
  (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
const segPoint = (s: Seg, t: number): Pt => [bez(t, s[0][0], s[1][0], s[2][0], s[3][0]), bez(t, s[0][1], s[1][1], s[2][1], s[3][1])];
const segPath = (s: Seg) => `M${s[0].join(" ")} C${s[1].join(" ")} ${s[2].join(" ")} ${s[3].join(" ")}`;

/* ------------------------------------------------------------------ */
/* Shared symbols — rendered once, referenced with <use href="#…">     */
/* ------------------------------------------------------------------ */

export const PETAL_D = "M0 1 C0.78 0.42 0.72 -0.6 0.3 -1 L0 -0.76 L-0.3 -1 C-0.72 -0.6 -0.78 0.42 0 1 Z";

export function SceneDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        {/* 5-petal sakura, radius ≈ 10; petals inherit `fill` from <use> */}
        <symbol id="sakura" viewBox="-12 -12 24 24" overflow="visible">
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d={PETAL_D} transform={`rotate(${a}) translate(0 -5.6) scale(3.6 5.2) rotate(180)`} />
          ))}
          <circle r="2.4" fill="#9e0f19" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} r="0.7" fill="#ffe08a" transform={`rotate(${a + 36}) translate(0 -3.6)`} />
          ))}
        </symbol>
        <symbol id="maple" viewBox="-12 -12 24 24" overflow="visible">
          <path d="M0 -11 L2.4 -4.6 L8.6 -7.2 L5.6 -1.4 L11 1.2 L4.6 2.8 L5.8 8 L0 4.8 L-5.8 8 L-4.6 2.8 L-11 1.2 L-5.6 -1.4 L-8.6 -7.2 L-2.4 -4.6 Z M0 4.8 L0 12" />
        </symbol>
        <radialGradient id="glow-warm">
          <stop offset="0" stopColor="#ffb36b" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ff5a3c" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff3b3b" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */

const STARS = (() => {
  const rand = rng(7);
  return Array.from({ length: 110 }, () => ({
    x: r2(rand() * 1600),
    y: r2(rand() * 560),
    r: r2(rand() * 1.4 + 0.3),
    o: r2(rand() * 0.6 + 0.2),
  }));
})();

export function Sky() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#040203" />
          <stop offset="0.5" stopColor="#12050a" />
          <stop offset="1" stopColor="#2c070d" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)" />
      {STARS.map((s, i) => (
        <circle key={i} className="h-star" cx={s.x} cy={s.y} r={s.r} fill="#f3efe8" opacity={s.o} />
      ))}
    </svg>
  );
}

export function Moon({ id = "m" }: { id?: string }) {
  return (
    <svg viewBox="0 0 400 400" className="size-full overflow-visible">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0.3" stopColor="#ff3b3b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff3b3b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-body`} cx="0.38" cy="0.32">
          <stop offset="0" stopColor="#ff7a80" />
          <stop offset="0.55" stopColor="#c8141f" />
          <stop offset="1" stopColor="#5e0710" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="200" fill={`url(#${id}-glow)`} />
      <circle cx="200" cy="200" r="96" fill={`url(#${id}-body)`} />
      <g fill="#7a0a12" opacity="0.4">
        <circle cx="168" cy="172" r="17" />
        <circle cx="230" cy="232" r="12" />
        <circle cx="216" cy="158" r="7" />
        <circle cx="158" cy="236" r="9" />
        <circle cx="250" cy="190" r="5" />
      </g>
      <g className="moon-clouds" fill="#070304" opacity="0.9">
        <rect x="70" y="218" width="210" height="7" rx="3.5" />
        <rect x="150" y="240" width="190" height="5" rx="2.5" />
      </g>
    </svg>
  );
}

export function Mountains() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
      <path d="M0 640 L140 560 L260 600 L420 500 L560 590 L700 540 L820 600 L980 520 L1120 590 L1260 510 L1420 580 L1600 540 L1600 900 L0 900 Z" fill="#12070a" />
      <path d="M0 700 L200 640 L380 680 L560 630 L760 690 L960 650 L1180 690 L1380 640 L1600 680 L1600 900 L0 900 Z" fill="#0b0507" />
    </svg>
  );
}

export function Temple() {
  const roof = (x1: number, x2: number, y: number, h: number) => {
    const mid = (x1 + x2) / 2;
    return `M${x1 - 40} ${y} Q${mid} ${y - h * 0.4} ${x2 + 40} ${y} L${x2 + 20} ${y - 12} Q${mid} ${y - h} ${x1 - 20} ${y - 12} Z`;
  };
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
      <g fill="#0a0709" stroke="#2a1316" strokeWidth="1.5">
        <rect x="770" y="330" width="60" height="40" />
        <path d={roof(760, 840, 335, 40)} />
        <rect x="797" y="270" width="6" height="40" />
        <rect x="700" y="400" width="200" height="50" />
        <path d={roof(690, 910, 405, 50)} />
        <rect x="610" y="470" width="380" height="80" />
        <path d={roof(600, 1000, 475, 60)} />
        <rect x="560" y="550" width="480" height="18" />
        <path d="M740 568 L860 568 L890 600 L710 600 Z" />
      </g>
      <g className="h-windows" fill="#ff7a4a">
        {[640, 700, 760, 820, 880, 940].map((x) => (
          <rect key={x} className="h-window" x={x} y="495" width="26" height="34" opacity="0.85" />
        ))}
        {[730, 790, 850].map((x) => (
          <rect key={x} className="h-window" x={x} y="415" width="20" height="24" opacity="0.6" />
        ))}
      </g>
      {[600, 1000, 690, 910].map((x, i) => (
        <g key={x} className="h-lantern">
          <circle cx={x} cy={i < 2 ? 500 : 425} r="30" fill="url(#glow-warm)" />
          <rect x={x - 5} y={i < 2 ? 492 : 417} width="10" height="16" rx="4" fill="#ff5a3c" />
        </g>
      ))}
    </svg>
  );
}

export function Torii() {
  return (
    <svg viewBox="0 0 400 420" className="size-full overflow-visible">
      <defs>
        <linearGradient id="torii-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4a050b" />
          <stop offset="0.55" stopColor="#a3101c" />
          <stop offset="1" stopColor="#5c070e" />
        </linearGradient>
      </defs>
      {/* pillars (slightly splayed) */}
      <path d="M92 96 L118 96 L124 420 L84 420 Z" fill="url(#torii-red)" />
      <path d="M282 96 L308 96 L316 420 L276 420 Z" fill="url(#torii-red)" />
      {/* nuki (tie beam) + gakuzuka (center strut) */}
      <rect x="44" y="150" width="312" height="18" fill="url(#torii-red)" />
      <rect x="188" y="104" width="24" height="46" fill="#7a0a12" />
      {/* shimaki + kasagi with upswept ends */}
      <path d="M28 88 L372 88 L366 106 L34 106 Z" fill="#8f0d17" />
      <path d="M0 58 Q200 82 400 58 L396 42 Q370 60 200 62 Q30 60 4 42 Z" fill="#1a0a0b" />
      <path d="M8 62 Q200 86 392 62 L386 88 L14 88 Z" fill="url(#torii-red)" />
      {/* moonlit rim */}
      <path d="M118 96 L124 420 M308 96 L316 420" stroke="#ff3b3b" strokeOpacity="0.35" strokeWidth="1.5" />
    </svg>
  );
}

export function StoneLantern() {
  return (
    <svg viewBox="0 0 120 230" className="size-full overflow-visible">
      <circle className="lantern-glow" cx="60" cy="92" r="70" fill="url(#glow-warm)" />
      <g fill="#141012" stroke="#2c2224" strokeWidth="1">
        <path d="M60 4 C66 10 66 16 60 20 C54 16 54 10 60 4 Z" />
        <path d="M14 58 Q60 26 106 58 L96 64 Q60 44 24 64 Z" />
        <rect x="28" y="64" width="64" height="8" />
        <rect x="32" y="72" width="56" height="44" />
        <rect x="24" y="116" width="72" height="10" />
        <rect x="48" y="126" width="24" height="70" />
        <path d="M30 196 L90 196 L100 230 L20 230 Z" />
      </g>
      <rect className="lantern-fire" x="44" y="80" width="32" height="28" fill="#ffb36b" />
      <path d="M60 80 L60 108 M44 94 L76 94" stroke="#141012" strokeWidth="3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sakura branches — blossoms are scattered along bezier limbs         */
/* ------------------------------------------------------------------ */

type Limb = { seg: Seg; w: number; blossoms: number };
type Blossom = { x: number; y: number; s: number; r: number; fill: string; kind: "sakura" | "maple" | "bud" };

const BLOSSOM_FILLS = ["#ffd6df", "#ffc2d1", "#f9a8bc", "#fde8ee", "#f48aa3"];

function scatter(limbs: Limb[], seed: number, spread = 26): Blossom[] {
  const rand = rng(seed);
  const out: Blossom[] = [];
  limbs.forEach(({ seg, blossoms }) => {
    for (let i = 0; i < blossoms; i++) {
      const t = 0.15 + rand() * 0.85;
      const [x, y] = segPoint(seg, t);
      const roll = rand();
      out.push({
        x: r2(x + (rand() - 0.5) * spread * 2),
        y: r2(y + (rand() - 0.5) * spread * 1.6),
        s: r2(0.7 + rand() * 0.9),
        r: r2(rand() * 360),
        fill: roll < 0.16 ? "#c1121f" : BLOSSOM_FILLS[Math.floor(rand() * BLOSSOM_FILLS.length)],
        kind: roll < 0.16 ? "maple" : roll < 0.26 ? "bud" : "sakura",
      });
    }
  });
  // paint back-to-front by size so big blooms sit on top
  return out.sort((a, b) => a.s - b.s);
}

// Branch growing from the left edge toward the upper right (flip with CSS for other sides).
const BRANCH_LIMBS: Limb[] = [
  { seg: [[-20, 420], [140, 380], [260, 340], [380, 260]], w: 20, blossoms: 10 },
  { seg: [[380, 260], [470, 200], [560, 180], [720, 120]], w: 11, blossoms: 16 },
  { seg: [[190, 370], [220, 310], [250, 280], [300, 240]], w: 6, blossoms: 10 },
  { seg: [[380, 260], [410, 310], [440, 330], [500, 340]], w: 5, blossoms: 10 },
  { seg: [[520, 172], [540, 128], [565, 100], [610, 78]], w: 4, blossoms: 9 },
  { seg: [[620, 142], [660, 160], [700, 176], [770, 168]], w: 3, blossoms: 9 },
  { seg: [[300, 290], [320, 330], [340, 360], [330, 400]], w: 3, blossoms: 6 },
];
const BRANCH_BLOSSOMS = scatter(BRANCH_LIMBS, 101);

const BUSH_LIMBS: Limb[] = [
  { seg: [[0, 300], [60, 240], [120, 200], [200, 170]], w: 9, blossoms: 14 },
  { seg: [[40, 300], [110, 260], [190, 250], [300, 230]], w: 7, blossoms: 14 },
  { seg: [[0, 260], [30, 200], [50, 160], [90, 120]], w: 5, blossoms: 10 },
];
const BUSH_BLOSSOMS = scatter(BUSH_LIMBS, 211, 30);

function BlossomField({ items, className }: { items: Blossom[]; className: string }) {
  return (
    <g>
      {items.map((b, i) =>
        b.kind === "bud" ? (
          <circle key={i} className={className} cx={b.x} cy={b.y} r={3.2 * b.s} fill="#f48aa3" />
        ) : (
          <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r}) scale(${b.s})`}>
            <use
              className={className}
              href={b.kind === "maple" ? "#maple" : "#sakura"}
              x="-12" y="-12" width="24" height="24"
              fill={b.fill}
            />
          </g>
        ),
      )}
    </g>
  );
}

export function SakuraBranch({ bloomClass = "bloom" }: { bloomClass?: string }) {
  return (
    <svg viewBox="0 0 800 460" className="size-full overflow-visible">
      <g stroke="#120809" strokeLinecap="round" fill="none">
        {BRANCH_LIMBS.map((l, i) => (
          <path key={i} d={segPath(l.seg)} strokeWidth={l.w} />
        ))}
      </g>
      <g stroke="#3a1a1c" strokeLinecap="round" fill="none" opacity="0.6">
        {BRANCH_LIMBS.slice(0, 2).map((l, i) => (
          <path key={i} d={segPath(l.seg)} strokeWidth={1.2} transform="translate(0 -4)" />
        ))}
      </g>
      <BlossomField items={BRANCH_BLOSSOMS} className={bloomClass} />
    </svg>
  );
}

export function SakuraBush({ bloomClass = "bloom" }: { bloomClass?: string }) {
  return (
    <svg viewBox="0 0 320 320" className="size-full overflow-visible">
      <ellipse cx="120" cy="300" rx="190" ry="60" fill="#070a08" />
      <g stroke="#120809" strokeLinecap="round" fill="none">
        {BUSH_LIMBS.map((l, i) => (
          <path key={i} d={segPath(l.seg)} strokeWidth={l.w} />
        ))}
      </g>
      <BlossomField items={BUSH_BLOSSOMS} className={bloomClass} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Hill — stretched (preserveAspectRatio="none") so its crest sits at   */
/* a predictable fraction of the layer height on every aspect ratio.    */
/* ------------------------------------------------------------------ */

const CREST: Seg[] = [
  [[0, 210], [220, 130], [420, 130], [640, 165]],
  [[640, 165], [860, 200], [1040, 130], [1260, 140]],
  [[1260, 140], [1420, 150], [1520, 175], [1600, 195]],
];
const HILL_PATH =
  `M${CREST[0][0].join(" ")} ` +
  CREST.map(([, a, b, c]) => `C ${a.join(" ")}, ${b.join(" ")}, ${c.join(" ")}`).join(" ") +
  " L1600 400 L0 400 Z";

function crestY(x: number) {
  const seg = CREST.find((s) => x <= s[3][0]) ?? CREST[CREST.length - 1];
  let lo = 0, hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, seg[0][0], seg[1][0], seg[2][0], seg[3][0]) < x) lo = mid;
    else hi = mid;
  }
  return bez(lo, seg[0][1], seg[1][1], seg[2][1], seg[3][1]);
}

const GRASS = (() => {
  const rand = rng(41);
  return Array.from({ length: 260 }, (_, i) => {
    const x = r2(Math.min(1600, (i / 260) * 1600 + rand() * 6));
    const base = crestY(x) + 4;
    const h = r2(rand() * 30 + 8);
    const lean = r2((rand() - 0.5) * 14);
    return `M${x} ${r2(base)} q${lean / 2} ${-h / 2} ${lean} ${-h}`;
  }).join(" ");
})();

export function Hill() {
  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className="absolute inset-0 size-full">
      <defs>
        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.3" stopColor="#1c2c20" />
          <stop offset="0.55" stopColor="#0c140e" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
      </defs>
      <path d={HILL_PATH} fill="url(#hill)" />
      <path d={GRASS} stroke="#2b4232" strokeWidth="1.6" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
