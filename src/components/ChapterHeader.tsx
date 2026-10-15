"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import RevealText from "./RevealText";

type Props = { num: string; label: string; title: string; kana?: string };

/** "01 — ORIGIN" eyebrow with a drawn rule, followed by a staggered serif title. */
export default function ChapterHeader({ num, label, title, kana }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
        tl.from(".ch-num", { yPercent: 100, duration: 1, ease: "expo.out" })
          .from(".ch-rule", { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "expo.inOut" }, 0.1)
          .from(".ch-label", { opacity: 0, x: -12, duration: 0.8 }, 0.5)
          .from(".ch-kana", { opacity: 0, y: 20, duration: 1 }, 0.4);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-4 text-[11px] tracking-[0.35em]">
        <span className="reveal-mask inline-block"><span className="ch-num text-ember">{num}</span></span>
        <span className="ch-rule h-px w-16 bg-bone/30" />
        <span className="ch-label text-ash">{label.toUpperCase()}</span>
      </div>
      <RevealText
        as="h2"
        text={title}
        className="mt-6 max-w-5xl font-serif text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[0.98] tracking-tight"
        stagger={0.05}
      />
      {kana && (
        <span className="ch-kana vertical-jp absolute right-0 top-0 hidden text-xl tracking-[0.5em] text-ember/70 md:block">
          {kana}
        </span>
      )}
    </div>
  );
}
