"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { chapters } from "@/data/portfolio";
import { scrollToTarget, useLenis } from "./SmoothScroll";

/** Fixed left-edge chapter index; highlights whichever chapter fills the viewport center. */
export default function ChapterRail() {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".rail-item");
      // NB: pass elements, not selector strings — useGSAP's scope would resolve
      // "#works" etc. inside the rail itself and find nothing.
      const byId = (id: string) => document.getElementById(id);
      const gallery = document.querySelector<HTMLElement>(".w-pin");

      // Show the rail only once the hero is gone.
      gsap.set(ref.current, { autoAlpha: 0, x: -20 });
      ScrollTrigger.create({
        trigger: byId("origin"),
        start: "top 60%",
        refreshPriority: -1, // measure after every pinned section has added its spacing
        onEnter: () => gsap.to(ref.current, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }),
        onLeaveBack: () => gsap.to(ref.current, { autoAlpha: 0, x: -20, duration: 0.4 }),
      });

      // Step aside while the horizontal gallery is pinned (cards run edge to edge).
      ScrollTrigger.create({
        trigger: gallery,
        start: "top 20%",
        refreshPriority: -1,
        end: () => `+=${gallery!.parentElement!.offsetHeight * 0.95}`,
        onToggle: (self) => gsap.to(".rail-list", { autoAlpha: self.isActive ? 0 : 1, duration: 0.4 }),
      });

      chapters.forEach((c, i) => {
        ScrollTrigger.create({
          trigger: byId(c.id),
          start: "top center",
          end: "bottom center",
          refreshPriority: -1,
          onToggle: (self) => self.isActive && items.forEach((el, j) => el.classList.toggle("is-active", j === i)),
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="invisible fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <ul className="rail-list space-y-4">
        {chapters.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => scrollToTarget(lenis, `#${c.id}`)}
              className="rail-item group flex items-center gap-3 text-[10px] tracking-[0.3em] text-bone/30 transition-colors hover:text-bone [&.is-active]:text-bone"
            >
              <span className="h-px w-3 bg-current transition-all duration-500 group-[.is-active]:w-7 group-[.is-active]:bg-ember" />
              {c.num}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
