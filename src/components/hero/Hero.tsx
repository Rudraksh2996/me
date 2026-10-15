"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { chapters, profile } from "@/data/portfolio";
import { scrollToTarget, useLenis } from "../SmoothScroll";
import { isIntroDone, onIntroDone } from "@/lib/intro";
import {
  Hill,
  Moon,
  Mountains,
  SakuraBranch,
  SakuraBush,
  SceneDefs,
  Sky,
  StoneLantern,
  Temple,
  Torii,
} from "./SceneLayers";

// Deterministic drifting petals
const PETALS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 17 + 5) % 96}%`,
  size: 7 + ((i * 5) % 9),
  delay: (i * 0.45) % 6,
  duration: 10 + ((i * 3) % 8),
  isMaple: i % 5 === 0,
}));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- 1. Synchronously build intro timeline with fromTo ---------- */
        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
        intro
          .fromTo(q(".i-sky"), { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
          .fromTo(q(".i-moon"), { opacity: 0, scale: 0.6, y: 70 }, { opacity: 1, scale: 1, y: 0, duration: 2.2 }, 0.15)
          .fromTo(q(".i-mountains"), { yPercent: 12, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2 }, 0.3)
          .fromTo(q(".i-temple"), { yPercent: 10, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2 }, 0.45)
          .fromTo(q(".i-torii"), { yPercent: 15, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 2 }, 0.5)
          .fromTo(q(".i-branch-l"), { xPercent: -20, yPercent: -10, opacity: 0 }, { xPercent: 0, yPercent: 0, opacity: 1, duration: 2.2 }, 0.55)
          .fromTo(q(".i-branch-r"), { xPercent: 20, yPercent: -10, opacity: 0 }, { xPercent: 0, yPercent: 0, opacity: 1, duration: 2.2 }, 0.55)
          .fromTo(q(".i-lantern"), { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 1.8 }, 0.6)
          .fromTo(q(".i-hill"), { yPercent: 35 }, { yPercent: 0, duration: 2 }, 0.4)
          // Explicit fromTo for RUDRAKSH letters: ALWAYS ends cleanly at yPercent: 0
          .fromTo(
            q(".h-letter"),
            { yPercent: 110 },
            { yPercent: 0, duration: 1.8, stagger: 0.07, ease: "expo.out" },
            0.65,
          )
          .fromTo(
            q(".h-line > span"),
            { yPercent: 115 },
            { yPercent: 0, duration: 1.3, stagger: 0.08 },
            1.0,
          )
          .fromTo(
            q(".h-fadein"),
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.07 },
            1.3,
          );

        if (isIntroDone()) {
          intro.play();
        } else {
          const off = onIntroDone(() => intro.play());
          const timer = setTimeout(() => intro.play(), 2500);
          // Keep timer cleanup
        }

        /* ---------- 2. Pinned multi-layer parallax on scroll ---------- */
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=140%",
            scrub: 1,
            pin: true,
          },
        });

        tl.to(q(".p-sky"), { scale: 1.1, yPercent: 3 }, 0)
          .to(q(".p-moon"), { yPercent: 45, scale: 1.2 }, 0)
          .to(q(".p-mountains"), { yPercent: 6 }, 0)
          .to(q(".p-temple"), { yPercent: 4, scale: 1.05 }, 0)
          .to(q(".p-torii"), { yPercent: -10, scale: 1.06, xPercent: 2 }, 0)
          .to(q(".p-word"), { yPercent: -35, scale: 1.05 }, 0)
          // Gradient pan through letters: turns bone-white into ember crimson
          .to(q(".h-letter"), { backgroundPosition: "50% 100%" }, 0)
          .to(q(".p-branch-l"), { xPercent: -14, yPercent: -6, scale: 1.1 }, 0)
          .to(q(".p-branch-r"), { xPercent: 14, yPercent: -6, scale: 1.1 }, 0)
          .to(q(".p-lantern"), { yPercent: -10, scale: 1.04 }, 0)
          .to(q(".p-hill"), { yPercent: -12, scale: 1.02 }, 0)
          .to(q(".p-ui"), { yPercent: -35, opacity: 0, duration: 0.45 }, 0)
          .to(q(".h-fade"), { opacity: 1, duration: 0.35 }, 0.65);

        /* ---------- 3. Ambient atmospheric motion ---------- */
        gsap.to(q(".h-lantern"), {
          opacity: "random(0.5, 1)",
          duration: "random(0.09, 0.3)",
          repeat: -1,
          repeatRefresh: true,
          ease: "steps(2)",
          stagger: { each: 0.1, from: "random" },
        });

        gsap.to(q(".lantern-fire"), {
          opacity: "random(0.7, 1)",
          scaleY: "random(0.9, 1.1)",
          duration: "random(0.12, 0.4)",
          repeat: -1,
          repeatRefresh: true,
          ease: "sine.inOut",
        });

        gsap.to(q(".h-star"), {
          opacity: "random(0.15, 0.95)",
          duration: "random(1.2, 3)",
          repeat: -1,
          repeatRefresh: true,
          ease: "sine.inOut",
          stagger: { each: 0.02, from: "random" },
        });

        gsap.utils.toArray<HTMLElement>(q(".h-petal")).forEach((petal) => {
          gsap.set(petal, { y: "-12vh", x: 0, rotate: gsap.utils.random(0, 360) });
          gsap.to(petal, {
            y: "112vh",
            x: `random(-140, 140)`,
            rotate: `+=${gsap.utils.random(200, 600)}`,
            duration: gsap.utils.random(8, 15),
            delay: gsap.utils.random(0, 8),
            ease: "none",
            repeat: -1,
          });
        });
      });
    },
    { scope: root },
  );

  const word = profile.heroWord.split("");

  return (
    <section ref={root} id="top" className="relative h-svh w-full overflow-hidden bg-ink select-none">
      <SceneDefs />

      {/* --- Depth Layer 1: Sky & Stars --- */}
      <div className="p-sky absolute inset-0 origin-top">
        <div className="i-sky absolute inset-0"><Sky /></div>
      </div>

      {/* --- Depth Layer 2: Glowing Blood Moon --- */}
      <div className="p-moon absolute right-[6%] top-[5%] aspect-square w-[clamp(220px,30vw,440px)] md:right-[14%]">
        <div className="i-moon size-full"><Moon /></div>
      </div>

      {/* --- Depth Layer 3: Distant Mountains --- */}
      <div className="p-mountains absolute inset-0">
        <div className="i-mountains absolute inset-0"><Mountains /></div>
      </div>

      {/* --- Depth Layer 4: Pagoda Temple --- */}
      <div className="p-temple absolute inset-0 origin-bottom">
        <div className="i-temple absolute inset-0"><Temple /></div>
      </div>

      {/* --- Depth Layer 5: Torii Gate --- */}
      {/* Positioned on the right side framing the scene, avoiding clash with the left headline text */}
      <div className="p-torii absolute right-[26%] top-[34%] aspect-[400/420] w-[clamp(110px,18vw,260px)] origin-bottom hidden sm:block md:right-[28%] md:top-[32%]">
        <div className="i-torii size-full"><Torii /></div>
      </div>

      {/* --- Depth Layer 6: Centerpiece Typographic Monolith (RUDRAKSH) --- */}
      {/* Positioned higher so all 8 letters are prominently visible above the hill crest */}
      <div className="p-word absolute inset-x-0 bottom-[18vh] flex origin-bottom justify-center md:bottom-[21vh]">
        <h1
          aria-label={profile.heroWord}
          className="flex overflow-hidden font-display text-[clamp(2.7rem,12vw,12.5vw)] font-black leading-[0.8] tracking-[0.02em] drop-shadow-[0_0_65px_rgba(193,18,31,0.35)]"
        >
          {word.map((ch, i) => (
            <span
              key={i}
              aria-hidden
              className="h-letter inline-block bg-clip-text text-transparent transition-transform"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,#ffffff 0%,#f0ebe3 34%,#ff4d4d 58%,#a3101c 80%,#200306 100%)",
                backgroundSize: "100% 260%",
                backgroundPosition: "50% 0%",
              }}
            >
              {ch}
            </span>
          ))}
        </h1>
      </div>

      {/* --- Depth Layer 7: Sakura Overhanging Branches (L & R) --- */}
      <div className="p-branch-l absolute -left-16 -top-4 aspect-[800/460] w-[clamp(280px,38vw,560px)] origin-top-left pointer-events-none">
        <div className="i-branch-l size-full"><SakuraBranch bloomClass="h-bloom-l" /></div>
      </div>

      <div className="p-branch-r absolute -right-16 top-0 aspect-[800/460] w-[clamp(280px,36vw,540px)] origin-top-right -scale-x-100 pointer-events-none">
        <div className="i-branch-r size-full"><SakuraBranch bloomClass="h-bloom-r" /></div>
      </div>

      {/* --- Depth Layer 8: Stone Lantern on Hill Slope --- */}
      <div className="p-lantern absolute right-[8%] bottom-[22vh] aspect-[120/230] w-[clamp(40px,5vw,70px)] origin-bottom pointer-events-none md:right-[12%] md:bottom-[24vh]">
        <div className="i-lantern size-full"><StoneLantern /></div>
      </div>

      {/* --- Depth Layer 9: Sakura Bush at Hill Foot --- */}
      <div className="absolute left-[2%] bottom-[16vh] aspect-square w-[clamp(100px,14vw,190px)] origin-bottom pointer-events-none md:left-[6%]">
        <SakuraBush bloomClass="h-bloom-bush" />
      </div>

      {/* --- Depth Layer 10: Foreground Hill & Grass Crest --- */}
      <div className="p-hill absolute inset-x-0 bottom-0 h-[22vh] origin-bottom md:h-[28vh]">
        <div className="i-hill absolute inset-0">
          <Hill />
          <div className="absolute inset-x-0 top-full h-[60vh] bg-[#050505]" />
        </div>
      </div>

      {/* --- Drifting Sakura / Maple Petals --- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className={`h-petal absolute top-0 ${
              p.isMaple ? "rounded-none bg-ember/90" : "rounded-[60%_0] bg-[#f9a8bc]/85"
            }`}
            style={{
              left: p.left,
              width: p.size,
              height: p.isMaple ? p.size : p.size * 0.72,
              transform: "translateY(-12vh)",
            }}
          />
        ))}
      </div>

      {/* Vignette & Scroll Transition Fades */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ink" />
      <div className="h-fade pointer-events-none absolute inset-0 bg-ink opacity-0" />

      {/* --- UI Overlay --- */}
      <div className="p-ui absolute inset-0 pointer-events-none">
        <div className="absolute left-5 top-24 max-w-[34rem] md:left-12 md:top-32">
          <p className="h-fadein mb-4 flex items-center gap-3 text-[10px] tracking-[0.35em] text-ash">
            <span className="h-px w-8 bg-ember" /> CHAPTER 00 — THE PROLOGUE
          </p>
          <h2 className="font-display text-[clamp(2.2rem,5.2vw,4.8rem)] font-extrabold uppercase leading-[0.94] tracking-tight">
            <span className="h-line reveal-mask block"><span>Where code</span></span>
            <span className="h-line reveal-mask block"><span>reveals the</span></span>
            <span className="h-line reveal-mask block">
              <span className="font-serif font-normal normal-case italic text-ember">unseen.</span>
            </span>
          </h2>
          <p className="h-fadein mt-5 max-w-sm text-sm leading-relaxed text-bone/70">{profile.tagline}</p>
          <p className="h-fadein mt-3 text-[10px] tracking-[0.3em] text-ash">
            {profile.roles.join("  ·  ").toUpperCase()}
          </p>
        </div>

        {/* Vertical Japanese Calligraphy */}
        <p className="h-fadein vertical-jp absolute right-5 top-28 hidden text-lg tracking-[0.5em] text-bone/80 md:right-12 md:top-32 md:block md:text-2xl">
          {profile.kana}
          <span className="mt-4 block text-ember">影の道</span>
        </p>

        {/* Chapter Jump Buttons */}
        <div className="pointer-events-auto absolute bottom-6 left-5 flex items-end gap-6 md:bottom-8 md:left-12 md:gap-10">
          {chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollToTarget(lenis, `#${c.id}`)}
              className="h-fadein group text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="block font-display text-2xl font-light text-bone/80 transition-colors group-hover:text-ember md:text-4xl">
                {c.num}
              </span>
              <span className="block text-[9px] tracking-[0.3em] text-ash opacity-0 transition-opacity group-hover:opacity-100">
                {c.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* Minimal Scroll Cue */}
        <div className="h-fadein absolute bottom-8 right-5 hidden items-center gap-3 text-[10px] tracking-[0.35em] text-ash md:right-12 md:flex">
          SCROLL
          <span className="relative block h-px w-16 overflow-hidden bg-bone/20">
            <span className="absolute inset-y-0 left-0 w-1/2 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-ember" />
          </span>
        </div>
      </div>
    </section>
  );
}
