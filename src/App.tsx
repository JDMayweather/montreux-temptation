import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Hero from "./chapters/Hero";
import Question from "./chapters/Question";
import WarTimeline from "./chapters/WarTimeline";
import Montreux from "./chapters/Montreux";
import TollTest from "./chapters/TollTest";
import Sovereignty from "./chapters/Sovereignty";
import India from "./chapters/India";
import Brics from "./chapters/Brics";
import ProgressIndicator from "./components/ProgressIndicator";

function isEmbed(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("embed");
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function useEmbedResize(): void {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!isEmbed()) return;
    document.documentElement.classList.add("embed");
    const PARENTS = ["https://www.news18.com", "https://news18.com"];
    const send = (): void => {
      const h = document.documentElement?.scrollHeight ?? 0;
      for (const o of PARENTS) window.parent?.postMessage({ type: "IMMERSIVE_RESIZE", height: h }, o);
    };
    send();
    // Height shifts as images/fonts settle — observe + resend.
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && document.body) {
      ro = new ResizeObserver(send);
      ro.observe(document.body);
    }
    const onLoad = () => send();
    window.addEventListener("resize", send);
    window.addEventListener("load", onLoad);
    const t1 = window.setTimeout(send, 500);
    const t2 = window.setTimeout(send, 2500);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => send()).catch(() => undefined);
    }
    return () => {
      window.removeEventListener("resize", send);
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro?.disconnect();
    };
  }, []);
}

function useLenis(): void {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    document.documentElement.classList.add("js");
    if (isEmbed() || prefersReducedMotion()) {
      document.documentElement.classList.add("no-motion");
      return;
    }
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number): void => {
      lenis.raf(time);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

function useScrollReveal(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Embed mode: iframe is full content height, parent scrolls — triggers never fire. Stay visible.
    if (isEmbed()) return;
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Chapter child stagger on enter
      gsap.utils.toArray<HTMLElement>(".chapter").forEach((section) => {
        const kids = section.querySelectorAll(":scope > h2, :scope > p, :scope > .cards, :scope > .fig");
        if (!kids.length) return;
        gsap.fromTo(
          kids,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.09,
            overwrite: "auto",
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
          }
        );
      });
      // Montreux compare cards fan in
      gsap.utils.toArray<HTMLElement>(".cards .card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40, rotate: i === 0 ? -1.5 : 1.5 },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);
}

export default function App(): React.JSX.Element {
  useEmbedResize();
  useLenis();
  useScrollReveal();
  return (
    <main className="immersive">
      <ProgressIndicator />
      <Hero />
      <Question />
      <WarTimeline />
      <Montreux />
      <TollTest />
      <Sovereignty />
      <India />
      <Brics />
      <footer className="footer">
        <div className="footer-inner">

          <p>Photographs credited individually. Maps and illustrations for editorial use.</p>
        </div>
      </footer>
      <div className="grain" aria-hidden="true" />
    </main>
  );
}
