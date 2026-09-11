import React, { useEffect, useRef } from "react";

interface FigureProps {
  src: string;
  alt: string;
  credit: string;
  caption?: string;
}

export default function Figure({ src, alt, credit, caption }: FigureProps): React.JSX.Element {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    // Embed mode: full-height iframe, everything is "in view" — show immediately.
    if (!el || typeof IntersectionObserver === "undefined") {
      el?.classList.add("is-in");
      return;
    }
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("embed")) {
      el.classList.add("is-in");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className="fig">
      <div className="fig-frame">
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption ? <figcaption className="fig-caption">{caption}</figcaption> : null}
      <div className="fig-credit">{credit}</div>
    </figure>
  );
}
