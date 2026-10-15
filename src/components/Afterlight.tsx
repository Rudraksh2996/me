"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { stack } from "@/data/portfolio";
import ChapterHeader from "./ChapterHeader";
import { scrollToTarget, useLenis } from "./SmoothScroll";

const BARS_PER_GROUP = 12;
const TOTAL = stack.length * BARS_PER_GROUP;
// Deterministic resting heights (0.25–1) shaped like a waveform.
const HEIGHTS = Array.from({ length: TOTAL }, (_, i) =>
  Math.round((0.45 + 0.3 * Math.sin(i * 0.55) + 0.2 * Math.sin(i * 1.7 + 1)) * 100) / 100,
).map((h) => Math.min(1, Math.max(0.25, h)));

export default function Afterlight() {
  const ref = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(ref);
      const bars = q(".eq-bar") as HTMLElement[];
      const panels = q(".al-panel") as HTMLElement[];
      const labels = q(".al-label") as HTMLElement[];
      const counter = q(".al-count")[0] as HTMLElement;
      let current = -1;

      gsap.set(panels, { autoAlpha: 0 });

      // Idle equalizer motion — each bar breathes at its own random rate.
      if (!reduce) {
        gsap.to(q(".eq-fill"), {
          scaleY: "random(0.55, 1)",
          duration: "random(0.35, 0.9)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
          stagger: { each: 0.02, from: "random" },
        });
      }

      const activate = (index: number) => {
        if (index === current) return;
        const prev = panels[current];
        const next = panels[index];
        const d = reduce ? 0 : 1;

        if (prev) {
          gsap.to(prev, { autoAlpha: 0, y: -40, filter: "blur(10px)", duration: 0.5 * d, ease: "power2.in", overwrite: "auto" });
        }
        gsap.fromTo(
          next,
          { autoAlpha: 0, y: 40, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9 * d, delay: prev ? 0.25 * d : 0, ease: "expo.out", overwrite: "auto" },
        );
        gsap.fromTo(
          next.querySelectorAll(".al-item"),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 * d, delay: 0.35 * d, stagger: 0.05 * d, ease: "power3.out", overwrite: "auto" },
        );
        // Counter rolls to the new number.
        gsap.fromTo(counter, { yPercent: 100 }, { yPercent: 0, duration: 0.6 * d, ease: "expo.out", onStart: () => {
          counter.textContent = String(index + 1).padStart(2, "0");
        } });

        labels.forEach((l, i) => l.classList.toggle("is-active", i === index));
        current = index;
      };

      stRef.current = ScrollTrigger.create({
        trigger: ".al-pin",
        start: "top top",
        end: `+=${stack.length * 80}%`,
        pin: true,
        onUpdate: (self) => {
          const p = self.progress;
          const index = Math.min(stack.length - 1, Math.floor(p * stack.length));
          const lit = p * TOTAL;
          // Light bars up to the scroll depth; raise + glow the active chapter's group.
          bars.forEach((bar, i) => {
            const group = Math.floor(i / BARS_PER_GROUP);
            bar.classList.toggle("is-lit", i < lit);
            bar.classList.toggle("is-active", group === index);
          });
          activate(index);
        },
        onRefresh: (self) => self.progress === 0 && activate(0),
      });
      activate(0);
    },
    { scope: ref },
  );

  const jumpTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    scrollToTarget(lenis, st.start + ((i + 0.5) / stack.length) * (st.end - st.start));
  };

  return (
    <section ref={ref} id="afterlight" className="relative">
      <div className="px-5 pt-32 md:pl-24 md:pr-10 md:pt-48">
        <ChapterHeader num="03" label="Afterlight" title="The instruments that remain after the light fades." kana="残光" />
      </div>

      <div className="al-pin relative flex h-svh flex-col justify-between overflow-hidden px-5 py-24 md:pl-24 md:pr-10">
        {/* crossfading copy */}
        <div className="relative flex-1">
          <div className="absolute left-0 top-0 flex items-baseline gap-3 font-display">
            <span className="reveal-mask inline-block text-6xl font-black text-ember md:text-8xl">
              <span className="al-count">01</span>
            </span>
            <span className="text-xl text-ash md:text-2xl">/ {String(stack.length).padStart(2, "0")}</span>
          </div>

          {stack.map((group) => (
            <div key={group.title} className="al-panel invisible absolute inset-0 grid content-center gap-8 md:grid-cols-12">
              <span
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-jp text-[38vw] leading-none text-bone/[0.035] md:text-[26vw]"
              >
                {group.kana}
              </span>
              <div className="md:col-span-7">
                <h3 className="font-serif text-[clamp(2.6rem,6.5vw,6rem)] font-light leading-none">{group.title}</h3>
                <p className="mt-4 font-serif text-xl italic text-ember md:text-2xl">{group.line}</p>
              </div>
              <ul className="flex flex-wrap content-end gap-x-6 gap-y-3 md:col-span-5">
                {group.items.map((item) => (
                  <li key={item} className="al-item flex items-center gap-2 text-lg text-bone/85 md:text-xl">
                    <span className="size-1.5 rounded-full bg-ember" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* equalizer timeline */}
        <div className="relative">
          <div className="flex h-36 items-end gap-[3px] md:h-48 md:gap-1.5">
            {HEIGHTS.map((h, i) => (
              <div key={i} className="eq-bar relative h-full flex-1">
                <div className="eq-col absolute inset-x-0 bottom-0" style={{ height: `${h * 100}%` }}>
                  <div className="eq-fill size-full origin-bottom rounded-t-[1px]" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid border-t border-bone/10 pt-4" style={{ gridTemplateColumns: `repeat(${stack.length}, 1fr)` }}>
            {stack.map((g, i) => (
              <button
                key={g.title}
                onClick={() => jumpTo(i)}
                className="al-label text-left text-[9px] tracking-[0.3em] text-ash transition-colors hover:text-bone md:text-[10px]"
              >
                <span className="text-ember">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-2 hidden sm:inline">{g.title.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
