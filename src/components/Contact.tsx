"use client";

import { useRef } from "react";
import { ArrowUpRight, Code, FileText, Mail } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, profile } from "@/data/portfolio";
import ChapterHeader from "./ChapterHeader";
import { GithubIcon, LinkedinIcon } from "./Icons";

const LINKS = [
  { label: "GitHub", href: contact.github, Icon: GithubIcon },
  { label: "LinkedIn", href: contact.linkedin, Icon: LinkedinIcon },
  { label: "LeetCode", href: contact.leetcode, Icon: Code },
  { label: "Resume", href: profile.resume, Icon: FileText },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".c-mail", {
          yPercent: 100,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".c-mail-wrap", start: "top 85%", once: true },
        });
        gsap.from(".c-link", {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".c-links", start: "top 90%", once: true },
        });
        // Oversized outlined name drifts sideways as the page ends.
        gsap.fromTo(
          ".c-marquee",
          { xPercent: 0 },
          { xPercent: -30, ease: "none", scrollTrigger: { trigger: ".c-marquee", start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden px-5 pt-32 md:pl-24 md:pr-10 md:pt-48">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[60vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(193,18,31,0.18),transparent_65%)]" />

      <ChapterHeader num="04" label="Contact" title="Step out of the shadow. Let's build something." kana="連絡" />

      <div className="c-mail-wrap reveal-mask mt-16 block md:mt-24">
        <a
          href={`mailto:${contact.email}`}
          className="c-mail group inline-flex items-center gap-4 break-all font-serif text-[clamp(1.5rem,5vw,4.5rem)] font-light italic"
        >
          <Mail className="size-[0.7em] shrink-0 text-ember" />
          <span className="bg-[linear-gradient(var(--color-ember),var(--color-ember))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[var(--ease-cine)] group-hover:bg-[length:100%_2px]">
            {contact.email}
          </span>
        </a>
      </div>

      <ul className="c-links mt-16 grid gap-px overflow-hidden border-y border-bone/10 sm:grid-cols-2 lg:grid-cols-4">
        {LINKS.map(({ label, href, Icon }) => (
          <li key={label} className="c-link">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between px-1 py-6 transition-colors hover:text-ember sm:px-4"
            >
              <span className="flex items-center gap-3 text-sm tracking-[0.25em]">
                <Icon className="size-4" /> {label.toUpperCase()}
              </span>
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </li>
        ))}
      </ul>

      <div aria-hidden className="c-marquee mt-24 whitespace-nowrap font-display text-[22vw] font-black leading-none text-transparent [-webkit-text-stroke:1px_rgba(243,239,232,0.14)]">
        {profile.name.toUpperCase()} · ルドラクシュ
      </div>

      <footer className="flex flex-col justify-between gap-2 border-t border-bone/10 py-8 text-[10px] tracking-[0.3em] text-ash sm:flex-row">
        <span>© 2026 {profile.name.toUpperCase()}</span>
        <span>CRAFTED IN THE DARK — NEXT.JS · GSAP · LENIS</span>
      </footer>
    </section>
  );
}
