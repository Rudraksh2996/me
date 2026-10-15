"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { profile } from "@/data/portfolio";

const COLUMNS = 6;

/**
 * Counter 000 → 100 while fonts load, then the curtain splits into columns that
 * lift away in a stagger, revealing the hero. Signals `markIntroDone()` as it lifts.
 */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      document.documentElement.classList.add("is-loading");

      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        markIntroDone();
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(ref.current, { display: "none" });
        finish();
        return;
      }

      const counter = { v: 0 };
      const num = ref.current!.querySelector<HTMLElement>(".pl-num")!;
      const fonts = document.fonts?.ready ?? Promise.resolve();

      const tl = gsap.timeline({ paused: true });
      tl.from(".pl-kanji", { opacity: 0, scale: 0.8, filter: "blur(12px)", duration: 1.2, ease: "expo.out" })
        .from(".pl-name > span", { yPercent: 110, stagger: 0.03, duration: 0.9, ease: "expo.out" }, 0.1)
        .to(counter, {
          v: 100,
          duration: 1.4,
          ease: "power3.inOut",
          onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")),
        }, 0)
        .to(".pl-bar", { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0)
        .to(".pl-content", { opacity: 0, y: -25, duration: 0.45, ease: "power2.in" }, "+=0.1")
        .to(".pl-col", {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
          stagger: { each: 0.05, from: "center" },
        }, "-=0.15")
        .add(finish, "-=0.8")
        .set(ref.current, { display: "none" });

      // Fast font readiness check so the animation starts right away.
      Promise.race([fonts, new Promise((r) => setTimeout(r, 250))]).then(() => tl.play());
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="fixed inset-0 z-[100]" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} className="pl-col h-full flex-1 bg-ink" style={{ marginLeft: i ? -1 : 0 }} />
        ))}
      </div>
      <div className="pl-content absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center">
          <span className="pl-kanji font-jp text-[clamp(5rem,12vw,9rem)] leading-none text-ember drop-shadow-[0_0_40px_rgba(193,18,31,0.6)]">
            影
          </span>
          <p className="pl-name reveal-mask mt-6 inline-block text-[11px] tracking-[0.5em] text-bone/80">
            {profile.name.toUpperCase().split("").map((c, i) => (
              <span key={i}>{c === " " ? " " : c}</span>
            ))}
          </p>
          <div className="mt-8 h-px w-48 overflow-hidden bg-bone/10">
            <div className="pl-bar h-full origin-left scale-x-0 bg-ember" />
          </div>
          <span className="pl-num mt-4 font-display text-xs tabular-nums tracking-[0.4em] text-ash">000</span>
        </div>
      </div>
    </div>
  );
}
