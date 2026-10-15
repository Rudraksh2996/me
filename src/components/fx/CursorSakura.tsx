"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Petal = {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; flip: number; vflip: number;
  size: number; life: number; max: number; phase: number;
  color: string; flower: boolean;
};

const PALETTE = ["#ffd6df", "#ffc2d1", "#f9a8bc", "#fde8ee", "#ffe4ea", "#e8576e", "#c1121f"];
const WEIGHTS = [5, 5, 4, 3, 3, 1.4, 1];
const MAX = 320;

// Unit sakura petal (base at +1, notched tip at -1).
const PETAL = typeof Path2D !== "undefined"
  ? new Path2D("M0 1 C0.78 0.42 0.72 -0.6 0.3 -1 L0 -0.76 L-0.3 -1 C-0.72 -0.6 -0.78 0.42 0 1 Z")
  : null;

function pickColor() {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PALETTE.length; i++) if ((r -= WEIGHTS[i]) <= 0) return PALETTE[i];
  return PALETTE[0];
}

/**
 * Custom ring cursor + a canvas that sheds cherry-blossom petals from the
 * pointer as it moves. Emission scales with travel distance; petals inherit a
 * share of the cursor's velocity, then flutter (3D flip), drift on a sine wind
 * and fall under light gravity before fading.
 */
export default function CursorSakura() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const fine = window.matchMedia("(pointer: fine)").matches;

      const canvas = root.current!.querySelector("canvas")!;
      const ctx = canvas.getContext("2d")!;
      const ring = root.current!.querySelector<HTMLElement>(".cur-ring")!;
      const dot = root.current!.querySelector<HTMLElement>(".cur-dot")!;
      const label = root.current!.querySelector<HTMLElement>(".cur-label")!;

      let dpr = 1, w = 0, h = 0;
      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      };
      resize();
      window.addEventListener("resize", resize);

      /* ---------- cursor ---------- */
      if (fine) {
        document.documentElement.classList.add("has-cursor");
        gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });
      }
      const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });
      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });

      const onOver = (e: PointerEvent) => {
        const el = (e.target as Element).closest<HTMLElement>("a, button, [data-cursor]");
        const text = el?.dataset.cursor ?? "";
        label.textContent = text;
        gsap.to(ring, {
          scale: el ? (text ? 3.2 : 2) : 1,
          backgroundColor: el ? "rgba(193,18,31,0.18)" : "rgba(193,18,31,0)",
          borderColor: el ? "rgba(255,59,59,0.9)" : "rgba(243,239,232,0.55)",
          duration: 0.45,
          ease: "expo.out",
        });
        gsap.to(label, { opacity: text ? 1 : 0, duration: 0.3 });
      };

      /* ---------- petals ---------- */
      const petals: Petal[] = [];
      let lastX = -1, lastY = -1, carry = 0, shown = false;

      const spawn = (x: number, y: number, dx: number, dy: number) => {
        if (petals.length >= MAX) petals.splice(0, petals.length - MAX + 1);
        const flower = Math.random() < 0.12;
        const max = gsap.utils.random(2.2, 3.8);
        petals.push({
          x: x + gsap.utils.random(-6, 6),
          y: y + gsap.utils.random(-6, 6),
          vx: dx * 0.06 + gsap.utils.random(-0.7, 0.7),
          vy: dy * 0.06 + gsap.utils.random(-1, 0.3),
          rot: Math.random() * Math.PI * 2,
          vr: gsap.utils.random(-0.06, 0.06),
          flip: Math.random() * Math.PI * 2,
          vflip: gsap.utils.random(0.04, 0.12),
          size: flower ? gsap.utils.random(6, 9) : gsap.utils.random(4, 8),
          life: 0,
          max,
          phase: Math.random() * Math.PI * 2,
          color: flower ? (Math.random() < 0.7 ? "#ffd6df" : "#fde8ee") : pickColor(),
          flower,
        });
      };

      const onMove = (e: PointerEvent) => {
        const { clientX: x, clientY: y } = e;
        if (fine) {
          if (!shown) {
            shown = true;
            gsap.set([ring, dot], { x, y });
            gsap.to([ring, dot], { opacity: 1, duration: 0.4 });
          }
          ringX(x); ringY(y); dotX(x); dotY(y);
        }
        if (lastX < 0) { lastX = x; lastY = y; return; }
        const dx = x - lastX, dy = y - lastY;
        carry += Math.hypot(dx, dy);
        // ~1 petal per 11px of travel, capped per event so flicks don't flood.
        const n = Math.min(6, Math.floor(carry / 11));
        for (let i = 0; i < n; i++) {
          const t = (i + 1) / (n + 1);
          spawn(lastX + dx * t, lastY + dy * t, dx, dy);
        }
        carry -= n * 11;
        lastX = x; lastY = y;
      };

      const onLeave = () => {
        lastX = -1;
        gsap.to([ring, dot], { opacity: 0, duration: 0.3 });
        shown = false;
      };

      const drawPetal = (p: Petal, alpha: number) => {
        ctx.save();
        ctx.translate(p.x * dpr, p.y * dpr);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        const s = p.size * dpr;
        if (p.flower) {
          ctx.scale(s * 0.55, s * 0.55);
          ctx.fillStyle = p.color;
          for (let k = 0; k < 5; k++) {
            ctx.save();
            ctx.rotate((k * Math.PI * 2) / 5);
            ctx.translate(0, -1.05);
            ctx.scale(0.62, 1);
            ctx.fill(PETAL!);
            ctx.restore();
          }
          ctx.fillStyle = "#c1121f";
          ctx.beginPath();
          ctx.arc(0, 0, 0.32, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // cos(flip) squashes one axis → reads as a petal tumbling in 3D
          ctx.scale(s * 0.62 * Math.cos(p.flip), s);
          ctx.fillStyle = p.color;
          ctx.fill(PETAL!);
        }
        ctx.restore();
      };

      let idle = true;
      const tick = (_t: number, dtMs: number) => {
        if (!petals.length) {
          if (!idle) { ctx.clearRect(0, 0, canvas.width, canvas.height); idle = true; }
          return;
        }
        idle = false;
        const dt = Math.min(dtMs, 50) / 16.67;
        const time = performance.now() * 0.0016;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = petals.length - 1; i >= 0; i--) {
          const p = petals[i];
          p.life += (dt * 16.67) / 1000;
          if (p.life >= p.max || p.y > h + 40) { petals.splice(i, 1); continue; }
          p.vy += 0.028 * dt; // gravity
          p.vx *= Math.pow(0.975, dt); // air drag
          p.vy *= Math.pow(0.985, dt);
          p.x += (p.vx + Math.sin(time + p.phase) * 0.45) * dt; // wind
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
          p.flip += p.vflip * dt;
          const k = p.life / p.max;
          const alpha = Math.min(1, p.life * 8) * (k > 0.55 ? 1 - (k - 0.55) / 0.45 : 1);
          drawPetal(p, alpha * 0.95);
        }
      };

      gsap.ticker.add(tick);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver);
      document.documentElement.addEventListener("pointerleave", onLeave);

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.documentElement.classList.remove("has-cursor");
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <canvas className="absolute inset-0" />
      <div className="cur-ring absolute left-0 top-0 grid size-9 place-items-center rounded-full border border-bone/55 opacity-0">
        <span className="cur-label text-[4px] font-semibold tracking-[0.2em] text-bone opacity-0" />
      </div>
      <div className="cur-dot absolute left-0 top-0 size-1.5 rounded-full bg-glow opacity-0" />
    </div>
  );
}
