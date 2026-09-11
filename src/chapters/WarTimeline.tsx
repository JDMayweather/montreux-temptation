import { useEffect, useRef, useState } from "react";
import { TIMELINE } from "../data/articleData";
import HormuzMap from "../components/HormuzMap";
import Figure from "../components/Figure";
import ScrollySection from "../components/ScrollySection";

const TANKER_SRC = "/bahri.jpeg";

const LAYER_KEYS = ["shipping", "attacks", "blockade", "diplomacy"] as const;
type LayerKey = (typeof LAYER_KEYS)[number];

const LAYER_LABELS: Record<LayerKey, string> = {
  shipping: "Shipping lane",
  attacks: "Attacks",
  blockade: "Blockade",
  diplomacy: "Diplomacy",
};

export default function WarTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    shipping: true,
    attacks: true,
    blockade: true,
    diplomacy: true,
  });
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggle = (key: LayerKey) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const active = TIMELINE[activeIndex];

  return (
    <ScrollySection className="war-timeline" data-num="02">
      <style>{`
        .wt-root {
          width: 100%;
          margin: 0;
          background: #07090d;
          color: #f2ede4;
          padding: 10vh 4vw;
        }
        .wt-grid {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          gap: 2.5rem;
          max-width: 80rem;
          margin: 0 auto;
          align-items: start;
        }
        .wt-sticky { position: sticky; top: 8vh; align-self: start; }
        .wt-date {
          font-family: "Arial Narrow", "Helvetica Neue", system-ui, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 0.95;
          font-size: clamp(2.8rem, 6vw, 5rem);
          margin: 0;
          color: #f2ede4;
        }
        .wt-date .wt-idx { color: #e0862a; }
        .wt-pill {
          border: 1px solid #3a4a5e;
          background: transparent;
          color: #aebccd;
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.25s ease, color 0.25s ease, background 0.25s ease;
        }
        .wt-pill[aria-pressed="true"] {
          border-color: #e0862a;
          color: #07090d;
          background: #e0862a;
          font-weight: 700;
        }
        .wt-pill:focus-visible { outline: 2px solid #e0862a; outline-offset: 2px; }
        .wt-step {
          min-height: 62vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 2px solid #1d2735;
          padding-left: 1.75rem;
          opacity: 0.35;
          transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.5s ease;
        }
        .wt-step.is-active { opacity: 1; transform: none; border-color: #e0862a; }
        @media (max-width: 900px) {
          .wt-root { padding: 6vh 4vw !important; }
          .wt-pills { display: none !important; }
          .wt-grid { grid-template-columns: 1fr; }
          .wt-sticky {
            position: sticky;
            top: 0;
            z-index: 5;
            background: rgba(7, 9, 13, 0.94);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            margin: 0 -4vw;
            padding: 0.75rem 4vw 0.9rem;
            border-bottom: 1px solid #1d2735;
          }
          .wt-date { font-size: clamp(1.6rem, 7vw, 2.4rem); }
          .wt-sticky svg { max-height: 30vh; }
          .wt-pill { padding: 0.65rem 1.1rem; font-size: 0.85rem; }
          .wt-step { min-height: 0; padding: 1.5rem 0 1.5rem 1.25rem; }
          .wt-step p { font-size: 1.05rem; line-height: 1.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wt-step, .wt-pill { transition: none; }
          .wt-step { transform: none; }
        }
      `}</style>
      <div className="wt-root">
        <div style={{ maxWidth: "80rem", margin: "0 auto 2rem" }}>
          <h2 style={{ margin: "0 0 2rem", fontFamily: '"Arial Narrow", "Helvetica Neue", system-ui, sans-serif', fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.015em", lineHeight: 0.95, fontSize: "clamp(2.4rem, 6vw, 5rem)" }}>TLDR: Too Long, Didn’t Read — A Brief History On The Current Conflict</h2>
        </div>
        <div className="wt-grid">
          <div className="wt-sticky">
            <p className="wt-date" aria-live="polite">
              <span className="wt-idx">{String(activeIndex + 1).padStart(2, "0")}</span>
              {" / "}{active?.date}
            </p>
            <p style={{ margin: "0.75rem 0 1.25rem", fontSize: "1.15rem", color: "#c6d2de" }}>
              {active?.title}
            </p>
            <HormuzMap activeIndex={activeIndex} layers={layers} />
            <div className="wt-pills" style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1.1rem" }} role="group" aria-label="Map layers — toggle what the map shows">
              {LAYER_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="wt-pill"
                  aria-pressed={layers[key]}
                  onClick={() => toggle(key)}
                >
                  {LAYER_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
          <div>
            {TIMELINE.map((event, i) => (
              <div
                key={event.date}
                data-index={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={i === activeIndex ? "wt-step is-active" : "wt-step"}
              >
                <p style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, margin: 0, color: i === activeIndex ? "#e0862a" : "#f2ede4" }}>
                  {event.date}
                </p>
                <h3 style={{ margin: "0.4rem 0", fontSize: "1.3rem" }}>{event.title}</h3>
                <p style={{ margin: 0, lineHeight: 1.6, color: "#aebccd" }}>{event.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: "48rem", margin: "4rem auto 0" }}>
            <Figure
              src={TANKER_SRC}
              alt="One of Saudi Arabia's Bahri oil tankers navigating open waters"
              caption="One of Saudi Arabia's Bahri oil tankers navigating open waters. (Source: SPA)"
              credit="Source: SPA"
            />
        </div>
      </div>
    </ScrollySection>
  );
}
