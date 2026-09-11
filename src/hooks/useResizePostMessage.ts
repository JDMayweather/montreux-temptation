import { useEffect } from "react";
import type { RefObject } from "react";

export const ALLOWED_PARENTS = ["https://www.news18.com", "https://news18.com"];

export function buildResizeMessage(height: number) {
  return { type: "IMMERSIVE_RESIZE" as const, height };
}

export function useResizePostMessage(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const post = (height: number) => {
      const message = buildResizeMessage(height);
      for (const parent of ALLOWED_PARENTS) {
        window.parent.postMessage(message, parent);
      }
    };

    post(el.getBoundingClientRect().height);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        post(entry.contentRect.height);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export { TIMELINE, MONTREUX_ROWS } from "../data/articleData";
