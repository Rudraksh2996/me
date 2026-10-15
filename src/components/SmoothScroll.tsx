"use client";

import { createContext, useContext, useEffect, useRef, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isIntroDone, onIntroDone } from "@/lib/intro";

type LenisRef = RefObject<Lenis | null>;
const LenisContext = createContext<LenisRef>({ current: null });
export const useLenis = () => useContext(LenisContext);

/** Scroll to a selector (or y offset), through Lenis when it's running. */
export function scrollToTarget(lenis: LenisRef, target: string | number) {
  if (lenis.current) {
    lenis.current.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });

    // Keep ScrollTrigger in lockstep with Lenis' virtual scroll position,
    // and drive Lenis from GSAP's ticker so both share one RAF loop.
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Hold the page still while the preloader curtain is down.
    if (!isIntroDone()) instance.stop();
    const off = onIntroDone(() => instance.start());

    lenis.current = instance;
    return () => {
      off();
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
