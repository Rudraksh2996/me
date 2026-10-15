"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { chapters, profile } from "@/data/portfolio";
import { scrollToTarget, useLenis } from "./SmoothScroll";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      // Fade in after the hero intro, then hide on scroll-down / reveal on scroll-up.
      // Intro runs on the inner <nav> so it doesn't fight the header's hide tween.
      gsap.from("nav", { y: -40, opacity: 0, duration: 1.2, delay: 1.6, ease: "expo.out" });

      const show = gsap
        .to(ref.current, { yPercent: -110, duration: 0.5, ease: "power3.inOut", paused: true })
        .progress(0);

      ScrollTrigger.create({
        start: "top top-=200",
        end: "max",
        onUpdate: (self) => (self.direction === 1 ? show.play() : show.reverse()),
      });
    },
    { scope: ref },
  );

  const go = (id: string) => {
    setOpen(false);
    scrollToTarget(lenis, `#${id}`);
  };

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex items-center justify-between px-5 py-5 md:px-10">
        <button onClick={() => scrollToTarget(lenis, 0)} className="group flex items-center gap-3 text-left">
          <span className="grid size-8 place-items-center rounded-full border border-ember/60 font-serif text-lg text-ember transition-colors group-hover:bg-ember group-hover:text-bone">
            R
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-[11px] font-semibold tracking-[0.3em]">{profile.name.toUpperCase()}</span>
            <span className="block text-[10px] tracking-[0.25em] text-ash">{profile.role.toUpperCase()}</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {chapters.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => go(c.id)}
                className="group flex items-baseline gap-1.5 px-4 py-2 text-[11px] tracking-[0.25em] text-bone/70 transition-colors hover:text-bone"
              >
                <span className="text-ember/80 transition-colors group-hover:text-ember">{c.num}</span>
                {c.label.toUpperCase()}
              </button>
            </li>
          ))}
          <li>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="ml-3 flex items-center gap-1 rounded-full border border-bone/20 px-4 py-2 text-[11px] tracking-[0.25em] transition-colors hover:border-ember hover:bg-ember"
            >
              RESUME <ArrowUpRight className="size-3.5" />
            </a>
          </li>
        </ul>

        <button
          className="grid size-10 place-items-center md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="mx-5 rounded-2xl border border-bone/10 bg-night/95 p-6 backdrop-blur md:hidden">
          {chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => go(c.id)}
              className="flex w-full items-baseline gap-3 py-3 text-left font-serif text-3xl"
            >
              <span className="font-sans text-xs text-ember">{c.num}</span>
              {c.label}
            </button>
          ))}
          <a href={profile.resume} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs tracking-[0.25em] text-ember">
            RESUME <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      )}
    </header>
  );
}
