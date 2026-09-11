import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  id?: string;
  className?: string;
  kicker?: string;
  "data-num"?: string;
  children: ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ScrollySection({ id, className, kicker, "data-num": dataNum, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || REDUCED) return;
    const targets = el.querySelectorAll(":scope > *");
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          overwrite: "auto",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id={id} data-chapter={id} data-num={dataNum} className={className ?? "scrolly-section"}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      {children}
    </section>
  );
}
