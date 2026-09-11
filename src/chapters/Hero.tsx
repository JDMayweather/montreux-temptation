import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

const HORMUZ_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/f/f5/Strait_of_Hormuz_%28MODIS_2020-12-04%29.jpg";

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const reduced = useReducedMotion();

  // Shrink-to-fit: fit longest line to width, then whole stack to viewport height.
  useEffect(() => {
    const el = titleRef.current;
    const root = rootRef.current;
    if (!el || !root || typeof window === "undefined") return;
    const fit = () => {
      el.style.fontSize = "";
      const avail = el.clientWidth;
      const lines = el.querySelectorAll<HTMLElement>(".hero-line-inner");
      let need = avail;
      lines.forEach((line) => {
        need = Math.max(need, line.scrollWidth);
      });
      if (need > avail && need > 0) {
        const base = parseFloat(window.getComputedStyle(el).fontSize) || 16;
        el.style.fontSize = `${(base * avail) / need}px`;
      }
      // Height fit: shrink title until the full stack fits 100svh.
      for (let i = 0; i < 3; i++) {
        const over = root.scrollHeight - window.innerHeight;
        if (over <= 1) break;
        const base = parseFloat(window.getComputedStyle(el).fontSize) || 16;
        const titleH = base * 0.92 * 3 || 1;
        const target = Math.max(titleH - over - 8, base * 0.5);
        el.style.fontSize = `${(base * target) / titleH}px`;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    let off = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!off) fit();
      });
    }
    return () => {
      off = true;
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const lines = root.querySelectorAll<HTMLElement>(".hero-line-inner");
    const fades = root.querySelectorAll<HTMLElement>(".hero-fade");
    const embed =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("embed");
    if (reduced || embed || typeof window === "undefined") {
      gsap.set(lines, { yPercent: 0 });
      gsap.set(fades, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(lines, {
        yPercent: 115,
        duration: 1.15,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.15,
      });
      gsap.from(fades, {
        opacity: 0,
        y: 18,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.7,
      });
      // Parallax: cover drifts down, content rises as hero scrolls away
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(".hero-cover", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-content", {
        yPercent: -10,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <header
      ref={rootRef}
      style={{
        position: "relative",
        width: "100%",
        margin: 0,
        height: "100svh",
        maxHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        background: "#05070b",
        color: "#f2ede4",
      }}
    >
      <style>{`
        .hero-mask { overflow: hidden; display: block; }
        .hero-line-inner { display: block; will-change: transform; }
        .hero-title {
          font-family: "Arial Narrow", "Helvetica Neue", system-ui, sans-serif;
          font-stretch: expanded;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 0.92;
          text-transform: uppercase;
          font-size: min(22svw, 22svh);
          white-space: nowrap;
          letter-spacing: -0.04em;
          margin: 0;
        }
        .hero-title .stroke {
          color: transparent;
          -webkit-text-stroke: 2px #f2ede4;
        }
        .hero-cover {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .hero-cue-line { animation: cue-drop 2s ease-in-out infinite; transform-origin: top; }
        @keyframes cue-drop { 0% { transform: scaleY(0); } 45% { transform: scaleY(1); } 100% { transform: scaleY(1); opacity: 0; } }
        .hero-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; max-width: 42rem; margin: 0 0 1.25rem; }
        .hero-row { display: flex; gap: 3rem; align-items: flex-end; }
        .hero-main { flex: 1 1 auto; min-width: 0; }
        .hero-map { flex: 0 0 min(560px, 44vw); border: 1px solid #1d2735; background: rgba(5,7,11,0.72); padding: 0.9rem; }
        .hero-map img { width: 100%; height: auto; max-height: 52vh; object-fit: contain; display: block; background: #0b1622; }
        @media (max-width: 760px) {
          .hero-row { flex-direction: column; align-items: stretch; gap: 1.25rem; }
          .hero-map { flex: none; }
          .hero-map img { max-height: 24vh; }
          .hero-title .stroke { color: #f2ede4; -webkit-text-stroke: 0; }
        }
        @media (max-width: 560px) {
          .hero-tiles { grid-template-columns: 1fr; gap: 0.4rem; margin-bottom: 1rem; }
        }
        @media (max-height: 800px) {
          .hero-cue, .hero-credit, .hero-stats { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-cue-line { animation: none !important; }
        }
      `}</style>

      <img
        className="hero-cover"
        src={HORMUZ_SRC}
        alt="Satellite view of the Strait of Hormuz between Iran and the Arabian Peninsula"
      />
      <div
        className="hero-fade"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,7,11,0.55) 0%, rgba(5,7,11,0.15) 35%, rgba(5,7,11,0.65) 78%, #05070b 100%)",
          pointerEvents: "none",
        }}
      />

      <div className="hero-content" style={{ position: "relative", zIndex: 1, padding: "8vh 6vw 0" }}>
        <div className="hero-row">
          <div className="hero-main">
        <div className="hero-fade hero-tiles" aria-label="Montreux 1936 versus Hormuz 2026">
          <div style={{ border: "1px solid rgba(242,237,228,0.35)", borderTop: "3px solid #e0862a", background: "rgba(5,7,11,0.55)", padding: "0.7rem 0.9rem" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", letterSpacing: "0.22em", fontWeight: 700, color: "#e0862a" }}>1936 · MONTREUX</p>
          </div>
          <div style={{ border: "1px solid rgba(242,237,228,0.35)", borderTop: "3px solid #c0392b", background: "rgba(5,7,11,0.55)", padding: "0.7rem 0.9rem" }}>
            <p style={{ margin: 0, fontSize: "0.72rem", letterSpacing: "0.22em", fontWeight: 700, color: "#e88" }}>2026 · HORMUZ</p>
          </div>
        </div>
        <h1 ref={titleRef} className="hero-title" aria-label="The Montreux Temptation">
          <span className="hero-mask">
            <span className="hero-line-inner">THE</span>
          </span>
          <span className="hero-mask">
            <span className="hero-line-inner">MONTREUX</span>
          </span>
          <span className="hero-mask">
            <span className="hero-line-inner stroke">TEMPTATION</span>
          </span>
        </h1>
        <p className="hero-fade" style={{ margin: "1rem 0 0", fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.5, color: "#c6d2de" }}>
          Can Iran Turn HORMUZ Into A Treaty-Governed Toll Strait?
        </p>
        <p className="hero-fade" style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#8a99ab" }}>
          By Anoshito Banerjee
        </p>
        <div className="hero-fade hero-stats" aria-label="Story in numbers" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
          <div>
            <p style={{ margin: 0, fontFamily: '"Arial Narrow", "Helvetica Neue", system-ui, sans-serif', fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "#f2ede4", lineHeight: 1 }}>70</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a99ab" }}>Attacks on ships</p>
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: '"Arial Narrow", "Helvetica Neue", system-ui, sans-serif', fontWeight: 900, fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "#f2ede4", lineHeight: 1 }}>19</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8a99ab" }}>Seafarers dead</p>
          </div>

        </div>
          </div>
          <aside className="hero-fade hero-map" aria-label="Map: Strait of Hormuz location">
            <p style={{ margin: "0 0 0.6rem", fontSize: "0.72rem", letterSpacing: "0.24em", fontWeight: 700, color: "#e0862a" }}>STRAIT OF HORMUZ — PERSIAN GULF / GULF OF OMAN</p>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/07/Strait_of_Hormuz-svg-en.svg"
              alt="Detailed map of the Strait of Hormuz between Iran and Oman"
              loading="eager"
            />
            <p style={{ margin: "0.6rem 0 0", fontSize: "0.72rem", color: "#8a99ab" }}>Map: Kleptosquirrel et al., CC BY-SA, via Wikimedia Commons</p>
          </aside>
        </div>
        <p className="hero-fade hero-credit" style={{ margin: "1.5rem 0 0", fontSize: "0.78rem", letterSpacing: "0.08em", color: "#8a99ab", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Satellite view, Strait of Hormuz &copy; NASA MODIS
        </p>
      </div>
    </header>
  );
}
