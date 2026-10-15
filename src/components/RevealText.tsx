"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  /** A string is split into words; an array is treated as pre-broken lines. */
  text: string | string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  stagger?: number;
  delay?: number;
  duration?: number;
  /** ScrollTrigger start position. */
  start?: string;
};

/**
 * Wraps each word (or line) in an overflow-hidden mask and slides the inner
 * span up + fades it in, staggered, when the block enters the viewport.
 */
export default function RevealText({
  text,
  as: Tag = "p",
  className,
  lineClassName,
  stagger = 0.06,
  delay = 0,
  duration = 1.1,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const isLines = Array.isArray(text);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = ref.current!.querySelectorAll<HTMLElement>(".reveal-mask > span");
        gsap.fromTo(
          targets,
          { yPercent: 115, rotate: 3, opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration,
            delay,
            stagger,
            ease: "expo.out",
            scrollTrigger: { trigger: ref.current, start, once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={isLines ? text.join(" ") : text}>
      {isLines
        ? text.map((line, i) => (
            <span key={i} aria-hidden className={`reveal-mask block ${lineClassName ?? ""}`}>
              <span>{line}</span>
            </span>
          ))
        : text.split(" ").map((word, i, arr) => (
            <span key={i} aria-hidden>
              <span className="reveal-mask inline-block">
                <span>{word}</span>
              </span>
              {i < arr.length - 1 ? " " : null}
            </span>
          ))}
    </Tag>
  );
}
