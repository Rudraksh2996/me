"use client";

import { useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, projects } from "@/data/portfolio";
import ChapterHeader from "./ChapterHeader";
import { GithubIcon } from "./Icons";

const GLYPHS = ["守", "金", "光"]; // protect · coin · light

export default function Works() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = ref.current!.querySelector<HTMLElement>(".w-track")!;
        const bar = ref.current!.querySelector<HTMLElement>(".w-bar")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        // Pin the gallery and convert vertical scroll into horizontal travel.
        // Pin length === horizontal distance, so scroll speed feels 1:1.
        const scrollTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".w-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
          },
        });

        // Per-card effects keyed to the *horizontal* position via containerAnimation.
        gsap.utils.toArray<HTMLElement>(".w-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".w-art"),
            { xPercent: -18 },
            {
              xPercent: 18,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
          gsap.from(card.querySelectorAll(".w-reveal"), {
            yPercent: 110,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: "left 75%", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="works" className="relative">
      <div className="px-5 pt-16 md:pl-24 md:pr-10 md:pt-24">
        <ChapterHeader num="02" label="Works" title="Selected works, built line by line." kana="作品" />
      </div>

      <div className="w-pin relative h-svh overflow-hidden motion-reduce:h-auto motion-reduce:overflow-x-auto">
        <div className="w-track flex h-full items-center gap-6 px-5 will-change-transform md:gap-10 md:pl-24 md:pr-10 motion-reduce:py-16">
          <div className="flex w-[70vw] shrink-0 flex-col justify-center md:w-[30vw]">
            <p className="text-[10px] tracking-[0.35em] text-ash">{String(projects.length).padStart(2, "0")} PROJECTS</p>
            <p className="mt-4 font-serif text-4xl font-light leading-tight md:text-5xl">
              Scroll to <em className="text-ember">traverse</em>
            </p>
            <ArrowRight className="mt-6 size-8 text-ember" />
          </div>

          {projects.map((p, i) => (
            <article
              key={p.title}
              className="w-card group relative flex h-[72svh] w-[85vw] shrink-0 flex-col overflow-hidden rounded-sm border border-bone/10 bg-night md:w-[52vw]"
            >
              {/* art panel */}
              <div className="relative h-1/2 overflow-hidden border-b border-bone/10 md:h-[55%]">
                <div className="w-art absolute inset-[-20%] flex items-center justify-center">
                  <div className="absolute size-[60%] rounded-full bg-[radial-gradient(circle,rgba(193,18,31,0.55),rgba(193,18,31,0)_65%)] transition-transform duration-700 group-hover:scale-110" />
                  <span className="relative font-jp text-[clamp(8rem,18vw,16rem)] leading-none text-bone/90">
                    {GLYPHS[i % GLYPHS.length]}
                  </span>
                </div>
                <span className="absolute left-5 top-4 font-display text-7xl font-black text-transparent [-webkit-text-stroke:1px_rgba(243,239,232,0.25)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* copy */}
              <div className="flex flex-1 flex-col p-5 md:p-8">
                <p className="reveal-mask block text-[10px] tracking-[0.35em] text-ember">
                  <span className="w-reveal">{p.kicker.toUpperCase()}</span>
                </p>
                <h3 className="reveal-mask block mt-2 font-serif text-4xl font-light md:text-5xl">
                  <span className="w-reveal">{p.title}</span>
                </h3>
                <p className="mt-3 line-clamp-4 max-w-xl text-sm leading-relaxed text-bone/65">{p.description}</p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
                  <ul className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <li key={t} className="rounded-full border border-bone/15 px-3 py-1 text-[10px] tracking-wider text-bone/70">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs tracking-[0.2em] transition-colors hover:text-ember"
                  >
                    <GithubIcon className="size-4" /> SOURCE <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}

          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="group flex w-[70vw] shrink-0 flex-col justify-center md:w-[28vw]"
          >
            <p className="text-[10px] tracking-[0.35em] text-ash">MORE IN THE ARCHIVE</p>
            <p className="mt-4 font-serif text-4xl font-light leading-tight transition-colors group-hover:text-ember md:text-5xl">
              github.com/
              <br />
              Rudraksh2996
            </p>
            <ArrowUpRight className="mt-6 size-8 text-ember transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="absolute inset-x-5 bottom-8 h-px bg-bone/10 md:inset-x-10 motion-reduce:hidden">
          <div className="w-bar h-full origin-left scale-x-0 bg-ember" />
        </div>
      </div>
    </section>
  );
}
