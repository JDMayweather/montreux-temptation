import { useEffect, useRef } from "react";
import Figure from "../components/Figure";

const STRAIT_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/e/e1/Dardanelles_map.png";

export default function Question() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      root?.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            root.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="q-root"
      data-num="01"
      style={{
        background: "transparent",
        color: "#f2ede4",
        width: "100%",
        margin: 0,
        padding: "12vh 6vw",
      }}
    >
      <style>{`
        .q-mask { display: block; overflow: hidden; }
        .q-line {
          display: block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease;
        }
        .q-root.is-visible .q-line { transform: translateY(0); opacity: 1; }
        .q-root.is-visible .d1 { transition-delay: 0.05s; }
        .q-root.is-visible .d2 { transition-delay: 0.16s; }
        .q-root.is-visible .d3 { transition-delay: 0.27s; }
        .q-prose { font-size: clamp(1rem, 1.8vw, 1.2rem); line-height: 1.65; color: #c6d2de; margin: 0 0 1.5rem; }
        .q-hook {
          font-family: "Arial Narrow", "Helvetica Neue", system-ui, sans-serif;
          font-size: clamp(2rem, 5vw, 3.75rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.015em;
          line-height: 0.95;
          color: #f2ede4;
          border-left: 6px solid #e0862a;
          padding-left: 1.25rem;
          margin: 2.5rem 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .q-line { transform: none; opacity: 1; transition: none; }
        }
        @media (max-width: 640px) {
          .q-root { padding: 6vh 5vw !important; }
          .q-prose { font-size: 1.1rem; line-height: 1.75; }
        }
      `}</style>

      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <span className="q-mask">
          <span className="q-line d1">
            <p className="q-prose">My idea for this article did not begin from a wire report. It began the way most ideas at a newsroom desk begin, badly, and in fragments — across weeks of conversation with different people from different teams and different shifts, that had nothing to do with each other until I started shouting “Eureka” in my mind the way Archimedes did.</p>
          </span>
        </span>
        <span className="q-mask">
          <span className="q-line d2">
            <p className="q-prose">Someone mentioned the Bosphorus, half as a joke. A very senior colleague. I couldn’t name the second strait, i.e. the Dardanelles, and I took it as insult upon my general knowledge and I started reading, and came across a 1936 text — that said, “The Montreux Convention”.</p>
          </span>
        </span>
        <span className="q-mask">
          <span className="q-line d2">
            <Figure
              src={STRAIT_SRC}
              alt="Topographic map of the Dardanelles strait"
              caption="The Dardanelles."
              credit="Public domain map, via Wikimedia Commons"
            />
          </span>
        </span>
        <span className="q-mask">
          <span className="q-line d3">
            <p className="q-prose">None of my conversations were about an article in general, but by the time they added up to one, in and out of the newsroom, across desks, after hours, talking with senior diplomats and my core advisory committee — my parents — the question had already been answered in my head.</p>
          </span>
        </span>
        <span className="q-mask">
          <span className="q-line d3">
            <p className="q-hook">If Turkey could toll a strait and make it hold for ninety years, why was Iran doing such a bad job of it?</p>
          </span>
        </span>
        <span className="q-mask">
          <span className="q-line d3">
            <p className="q-prose">The question needed an answer and I couldn’t get it sitting behind a desk. I needed perspective, and that search found me at the doorstep of the Iranian embassy in New Delhi, 5 Barakhamba Road.</p>
            <p className="q-prose">I had been here before, first stepping through the doors in the 1st week of April for another article. Back then I met the First Officer and Press Secretary, Mr. Agha Mahdi Esfandiari — a thorough diplomat and gentleman.</p>
            <p className="q-prose">It was the first of several sittings that would stretch, unhurried, until the last week of August, the 25th, when recently we shared some hot decadent Iranian tea in a glass rimmed with gold. Apparently, you’re supposed to have some sugar on the tongue, but having a sweet tooth, I couldn’t help but put a single cube in the cup.</p>
            <p className="q-prose">Mr. Esfandiari did not offer talking points. He offered tea, and time, again on August 25, the last sitting of the summer. What passed between those sittings stays where it was said.</p>
            <p className="q-prose">The war, however, is very much on the record.</p>
          </span>
        </span>
      </div>
    </section>
  );
}
