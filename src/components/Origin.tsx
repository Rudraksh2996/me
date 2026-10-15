"use client";

import { useRef } from "react";
import { Award, GraduationCap } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { certifications, coursework, education, profile } from "@/data/portfolio";
import ChapterHeader from "./ChapterHeader";
import RevealText from "./RevealText";

const STATEMENT = ["Forged in", "Python.", "Bound for", "Agentic AI."];

export default function Origin() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Statement lines: staggered slide-up on enter...
        gsap.from(".st-line > span", {
          yPercent: 120,
          skewY: 6,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".statement", start: "top 80%", once: true },
        });
        // ...then alternate lines drift in opposite directions while scrolling through.
        gsap.utils.toArray<HTMLElement>(".st-line").forEach((line, i) => {
          gsap.fromTo(
            line,
            { xPercent: i % 2 ? 6 : -6 },
            {
              xPercent: i % 2 ? -6 : 6,
              ease: "none",
              scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Detail blocks and list items cascade in.
        gsap.utils.toArray<HTMLElement>(".fade-block").forEach((block) => {
          gsap.from(block.querySelectorAll(".fade-item"), {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: "power3.out",
            stagger: 0.07,
            scrollTrigger: { trigger: block, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="origin" className="relative px-5 py-32 md:pl-24 md:pr-10 md:py-48">
      <ChapterHeader num="01" label="Origin" title="A student of the craft, moving through the dark toward the light." kana="起源" />

      <div className="statement my-28 md:my-40">
        {STATEMENT.map((line, i) => (
          <div
            key={line}
            className={`st-line reveal-mask block font-display text-[clamp(3rem,12vw,11rem)] font-black uppercase leading-[0.86] tracking-tight ${
              i % 2 ? "text-right" : ""
            } ${i === 3 ? "text-ember" : ""}`}
          >
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <RevealText
            text={profile.bio}
            className="font-serif text-[clamp(1.6rem,2.8vw,2.4rem)] font-light leading-snug text-bone/90"
            stagger={0.025}
          />
          <RevealText text={profile.seeking} className="mt-6 text-sm tracking-wide text-ember" />
        </div>

        <div className="fade-block space-y-10 md:col-span-5 md:col-start-8">
          <div className="fade-item border-t border-bone/15 pt-6">
            <p className="mb-3 flex items-center gap-2 text-[10px] tracking-[0.35em] text-ash">
              <GraduationCap className="size-4 text-ember" /> EDUCATION
            </p>
            <p className="font-serif text-2xl">{education.degree}</p>
            <p className="mt-1 text-sm text-ash">{education.years}</p>
          </div>

          <div className="fade-item border-t border-bone/15 pt-6">
            <p className="mb-4 flex items-center gap-2 text-[10px] tracking-[0.35em] text-ash">
              <Award className="size-4 text-ember" /> CERTIFICATIONS
            </p>
            <ul className="space-y-3">
              {certifications.map((c) => (
                <li key={c.title} className="fade-item">
                  <p className="font-serif text-xl leading-tight">{c.title}</p>
                  <p className="text-xs text-ash">{c.issuer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="fade-block mt-24 border-t border-bone/15 pt-6">
        <p className="fade-item mb-6 text-[10px] tracking-[0.35em] text-ash">CORE COURSEWORK</p>
        <ul className="flex flex-wrap gap-3">
          {coursework.map((c) => (
            <li
              key={c}
              className="fade-item rounded-full border border-bone/15 px-4 py-2 text-xs tracking-wide text-bone/80 transition-colors hover:border-ember hover:text-bone"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
