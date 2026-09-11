# Montreux Temptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build full 7-chapter immersive React SPA with News18 iframe embed.

**Architecture:** Vite SPA, GSAP ScrollTrigger scrolly, inline SVG maps primary, Three.js hero-only lazy, `?embed=true` trims chrome, ResizeObserver postMessage resize.

**Tech Stack:** React 18, TypeScript 5, Vite 5, GSAP 3 + ScrollTrigger, Lenis, Vitest + Testing Library, Three (lazy only).

**Spec:** `docs/superpowers/specs/2026-09-11-montreux-design.md`

## Global Constraints
- Critical payload <3MB; lazy maps/WebGL via React.lazy + IntersectionObserver.
- Mobile scroll-first, tap not hover; desktop cinematic wide layouts allowed.
- `prefers-reduced-motion`: disable Lenis + GSAP cinematics; full text readable sans-animation.
- Embed parent allowlist: `https://www.news18.com`, `https://news18.com`; prod postMessage never `*`.
- Vercel CSP `frame-ancestors 'self' https://www.news18.com https://news18.com`; no `X-Frame-Options: DENY`.
- Copy/dates/figures match docx paras exactly (Feb28, Apr11-12, Apr13, May05, Jun17, Jul08, Jul14, Aug31, Mar12, Sep12-13, $6.70, 57 vessels, 85kt, 28 ships/800 seafarers, 70 attacks/19 dead).
- No MapLibre in V1; no CMS-injected React (iframe only).

---

### Task 1: Scaffold + config + Vercel embed headers

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `vercel.json`, `src/vite-env.d.ts`
- Test: `tests/scaffold.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `npm run dev/build/preview/test` scripts; `vercel.json` headers; App shell mount point

- [ ] **Step 1: Write failing test**

```ts
// tests/scaffold.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
describe("scaffold", () => {
  it("has vercel frame-ancestors for news18", () => {
    const v = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
    const csp = v.headers[0].headers.find((h: any) => h.key === "Content-Security-Policy").value;
    expect(csp).toContain("frame-ancestors");
    expect(csp).toContain("https://www.news18.com");
  });
  it("has app entry", () => {
    expect(fs.existsSync("src/App.tsx")).toBe(true);
    expect(fs.existsSync("index.html")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/scaffold.test.ts`
Expected: FAIL (files missing)

- [ ] **Step 3: Scaffold minimal implementation**

`package.json`:
```json
{
  "name": "montreux-temptation",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.167.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.0",
    "vitest": "^2.0.5",
    "jsdom": "^24.1.0"
  }
}
```

`vite.config.ts`:
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
  test: { environment: "jsdom" } as any,
});
```

`vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "frame-ancestors 'self' https://www.news18.com https://news18.com;" }
      ]
    }
  ]
}
```

`index.html`: root div + `/src/main.tsx` script, title "The Montreux Temptation".

`src/main.tsx`:
```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/immersive.css";
createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
```

`src/App.tsx` (placeholder shell, full chapters land in later tasks):
```tsx
export default function App() {
  return <main id="immersive-root"><h1>The Montreux Temptation</h1></main>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm install; npm test -- tests/scaffold.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git init; git add -A; git commit -m "feat: scaffold vite react ts vercel embed headers"
```

---

### Task 2: Data + embed hooks + resize bridge

**Files:**
- Create: `src/data/articleData.ts`, `src/hooks/useEmbed.ts`, `src/hooks/useReducedMotion.ts`, `src/hooks/useResizePostMessage.ts`
- Test: `tests/data-embed.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `TIMELINE`, `MONTREUX_ROWS`, `DIPLOMACY`, `ESCORT`, `isEmbed()`, `ALLOWED_PARENTS`, `buildResizeMessage(height)`

- [ ] **Step 1: Write failing test**

```ts
// tests/data-embed.test.ts
import { describe, it, expect } from "vitest";
import { TIMELINE, MONTREUX_ROWS, ALLOWED_PARENTS, buildResizeMessage } from "../src/hooks/useResizePostMessage";
import { TIMELINE as T2 } from "../src/data/articleData";
describe("data-embed", () => {
  it("timeline has 9 anchored dates", () => {
    expect(T2.length).toBe(9);
    expect(T2[0].date).toMatch(/Feb 28/);
  });
  it("montreux contrast rows exist", () => {
    expect(MONTREUX_ROWS.length).toBeGreaterThanOrEqual(5);
  });
  it("resize message locked to allowlist", () => {
    expect(ALLOWED_PARENTS).toContain("https://www.news18.com");
    const m = buildResizeMessage(1234);
    expect(m).toEqual({ type: "IMMERSIVE_RESIZE", height: 1234 });
  });
  it("timeline export consistent", () => {
    expect(TIMELINE.length).toBe(T2.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/data-embed.test.ts`
Expected: FAIL (modules missing)

- [ ] **Step 3: Write minimal implementation**

`src/data/articleData.ts`:
```ts
export const TIMELINE = [
  { date: "Feb 28, 2026", title: "Epic Fury / Rising Lion", body: "US-Israel strikes kill Khamenei. Hormuz closes within hours." },
  { date: "Apr 11–12", title: "Islamabad talks fail", body: "Diplomacy collapses." },
  { date: "Apr 13", title: "US naval blockade", body: "Blockade on Iranian ports." },
  { date: "May 05", title: "PGSA created", body: "Permit + fee body for transit." },
  { date: "Jun 17", title: "Islamabad Memorandum", body: "60 days toll-free passage. US lifts blockade Jun 18." },
  { date: "Jul 08", title: "Commercial ships struck", body: "Iran hits vessels; deal breaks 3 weeks early." },
  { date: "Jul 14", title: "Blockade reimposed", body: "US strikes back." },
  { date: "Aug 31", title: "Sidr attacked", body: "Saudi tanker hit; 2 Filipino crew dead." },
  { date: "Early Sep", title: "Toll stands", body: "IMO: 70 attacks verified, 19+ seafarers dead; PGSA lists 57 non-compliant." },
];
export const MONTREUX_ROWS = [
  { k: "Instrument", turkey: "International treaty", iran: "Permit system" },
  { k: "Charge basis", turkey: "3 named services (Art 2)", iran: "Right-to-pass payment" },
  { k: "Rate", turkey: "$6.70 / net ton (Annex I)", iran: "Unpublished tariff" },
  { k: "Equality", turkey: "Flag-blind, discounts apply equally", iran: "57-vessel compliance distinction" },
  { k: "Legitimacy", turkey: "Ratified, survives UN scrutiny", iran: "Weak international legitimacy" },
];
export const DIPLOMACY = [
  { date: "Mar 12", event: "Modi → Pezeshkian call" },
  { date: "Following weeks", event: "Jaishankar → Araghchi ×3" },
  { date: "+2 days", event: "MT Nanda Devi + MT Shivalik exit under escort, ~85kt LPG" },
];
export const ESCORT = { ships: ["MT Nanda Devi", "MT Shivalik"], cargo: "85,000 metric tonnes LPG", note: "First cargo of any flag in almost two weeks" };
```

`src/hooks/useEmbed.ts`:
```ts
export function isEmbed() {
  return new URLSearchParams(window.location.search).has("embed");
}
```

`src/hooks/useReducedMotion.ts`:
```ts
import { useEffect, useState } from "react";
export function useReducedMotion() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setV(mq.matches);
    const fn = (e: MediaQueryListEvent) => setV(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return v;
}
```

`src/hooks/useResizePostMessage.ts`:
```ts
export const ALLOWED_PARENTS = ["https://www.news18.com", "https://news18.com"];
export const TIMELINE = (await import("../data/articleData")).TIMELINE;
export const MONTREUX_ROWS = (await import("../data/articleData")).MONTREUX_ROWS;
```
Replace with non-top-level-await version for build safety:
```ts
import { TIMELINE as T, MONTREUX_ROWS as M } from "../data/articleData";
export const TIMELINE = T;
export const MONTREUX_ROWS = M;
export const ALLOWED_PARENTS = ["https://www.news18.com", "https://news18.com"];
export function buildResizeMessage(height: number) {
  return { type: "IMMERSIVE_RESIZE", height };
}
export function useResizePostMessage(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const send = () => {
      const h = document.documentElement.scrollHeight;
      const msg = buildResizeMessage(h);
      for (const o of ALLOWED_PARENTS) window.parent.postMessage(msg, o);
    };
    const ro = new ResizeObserver(send);
    ro.observe(el);
    send();
    return () => ro.disconnect();
  }, [ref]);
}
```
(final file uses second version with `import { useEffect } from "react"`)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/data-embed.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data src/hooks tests/data-embed.test.ts; git commit -m "feat: article data plus embed resize bridge"
```

---

### Task 3: Shell + scrolly primitives + styles

**Files:**
- Create: `src/components/ScrollySection.tsx`, `src/components/ProgressIndicator.tsx`, `src/components/DataReveal.tsx`, `src/styles/immersive.css`
- Modify: `src/App.tsx`
- Test: `tests/shell.test.tsx`

**Interfaces:**
- Consumes: `isEmbed()`, `useReducedMotion()`
- Produces: `<ScrollySection id>`, `<ProgressIndicator>`, `<DataReveal text>`, App chapter scaffold with embed trim

- [ ] **Step 1: Write failing test**

```tsx
// tests/shell.test.tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import App from "../src/App";
describe("shell", () => {
  it("renders title and chapters", () => {
    const html = renderToString(<App />);
    expect(html).toContain("MONTREUX");
    expect(html).toContain("data-chapter");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/shell.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`ScrollySection.tsx`: section wrapper with `data-chapter=id`, min-height 100svh, GSAP fade-up unless reduced-motion.
`ProgressIndicator.tsx`: fixed top bar, ScrollTrigger progress.
`DataReveal.tsx`: big stat reveal on enter.
`immersive.css`: black `#05070b` theme, serif display + sans body, chapter spacing, split layout, reduced-motion media query kills transforms.
`App.tsx`: Lenis init (skip if embed/reduced-motion), header (hidden in embed), 7 chapter sections with real copy stubs from spec, footer (hidden in embed), resize hook wired.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/shell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components src/styles src/App.tsx tests/shell.test.tsx; git commit -m "feat: shell scrolly progress reveal styles"
```

---

### Task 4: Hero + Question

**Files:**
- Create: `src/chapters/Hero.tsx`, `src/chapters/Question.tsx`, `src/components/HeroParticles.tsx` (lazy Three)
- Test: `tests/hero.test.tsx`

**Interfaces:**
- Consumes: `ScrollySection`, `TIMELINE`
- Produces: `<Hero/>` Gulf outline + ship lights + Bosphorus→Hormuz morph; `<Question/>` fragments + hook freeze

- [ ] **Step 1: Write failing test**

```tsx
// tests/hero.test.tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Hero from "../src/chapters/Hero";
import Question from "../src/chapters/Question";
describe("hero-question", () => {
  it("hero states comparison", () => {
    expect(renderToString(<Hero />)).toMatch(/MONTREUX.*HORMUZ|HORMUZ.*MONTREUX/s);
  });
  it("question has hook", () => {
    expect(renderToString(<Question />)).toContain("bad job");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/hero.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`Hero.tsx`: full-viewport SVG — Persian Gulf outline path, animated dashed shipping lane + 3 circle ship lights (CSS keyframes), scroll-pinned morph label MONTREUX 1936 → HORMUZ 2026, `HeroParticles` lazy-loaded only on desktop non-reduced-motion.
`Question.tsx`: fragments "Bosphorus" / "Dardanelles" / "1936" / "Montreux Convention" converge on scroll; freeze frame hook "If Turkey could toll a strait… why was Iran doing such a bad job of it?"; embassy beat (Barakhamba, Aug 25 tea, no talking points).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/hero.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/chapters/Hero.tsx src/chapters/Question.tsx src/components/HeroParticles.tsx tests/hero.test.tsx; git commit -m "feat: hero morph plus question hook"
```

---

### Task 5: War timeline + Hormuz map layers

**Files:**
- Create: `src/chapters/WarTimeline.tsx`, `src/components/HormuzMap.tsx`
- Test: `tests/timeline.test.tsx`

**Interfaces:**
- Consumes: `TIMELINE`, `ScrollySection`
- Produces: `<WarTimeline/>` pinned map-as-timeline with layer toggles shipping/attacks/blockade/diplomacy

- [ ] **Step 1: Write failing test**

```tsx
// tests/timeline.test.tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import WarTimeline from "../src/chapters/WarTimeline";
describe("timeline", () => {
  it("anchors all dates", () => {
    const html = renderToString(<WarTimeline />);
    for (const d of ["Feb 28", "Apr 13", "May 05", "Jun 17", "Jul 08", "Aug 31"]) expect(html).toContain(d);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/timeline.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`HormuzMap.tsx`: SVG Iran/Oman/Gulf/Hormuz, route paths, props `activeIndex + layers`; traffic opacity falls as timeline advances; blockade hatch zone; attack pulse markers Jul08/Aug31.
`WarTimeline.tsx`: sticky date left, scroll steps drive `activeIndex`; toggle buttons set layers (default all on); reduced-motion renders static list.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/timeline.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/chapters/WarTimeline.tsx src/components/HormuzMap.tsx tests/timeline.test.tsx; git commit -m "feat: war timeline map layers"
```

---

### Task 6: Montreux split + toll test + sovereignty/FONOP

**Files:**
- Create: `src/chapters/Montreux.tsx`, `src/chapters/TollTest.tsx`, `src/chapters/Sovereignty.tsx`
- Test: `tests/montreux.test.tsx`

**Interfaces:**
- Consumes: `MONTREUX_ROWS`
- Produces: `<Montreux/>` split compare; `<TollTest/>` 5-check fracture; `<Sovereignty/>` tanker flow + FONOP fragment

- [ ] **Step 1: Write failing test**

```tsx
// tests/montreux.test.tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import Montreux from "../src/chapters/Montreux";
import TollTest from "../src/chapters/TollTest";
import Sovereignty from "../src/chapters/Sovereignty";
describe("montreux", () => {
  it("split shows treaty vs permit", () => {
    const h = renderToString(<Montreux />);
    expect(h).toContain("$6.70"); expect(h).toContain("57");
  });
  it("toll test asks 5 checks", () => {
    expect(renderToString(<TollTest />)).toContain("survive");
  });
  it("sovereignty asks who pays", () => {
    expect(renderToString(<Sovereignty />)).toMatch(/WHO PAYS|WHO DEFINES/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/montreux.test.tsx`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`Montreux.tsx`: vertical split Turkey 1936 / Iran 2026 rows from `MONTREUX_ROWS`; scroll highlights.
`TollTest.tsx`: diamond legitimacy/equality/transparency/services; Iran model fractures (CSS crack shift, no cheesy X).
`Sovereignty.tsx`: tanker translate across; profit tags up, cost tags down; FONOP text fragments into "WHO DEFINES FREEDOM?" + Fifth/Seventh Fleet markers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/montreux.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/chapters/Montreux.tsx src/chapters/TollTest.tsx src/chapters/Sovereignty.tsx tests/montreux.test.tsx; git commit -m "feat: montreux split toll sovereignty"
```

---

### Task 7: India + BRICS + embed.js + deploy check

**Files:**
- Create: `src/chapters/India.tsx`, `src/chapters/Brics.tsx`, `public/embed.js`, `tests/india-brics.test.tsx`, `tests/embed.test.ts`
- Modify: `src/App.tsx` (wire all chapters)

**Interfaces:**
- Consumes: `DIPLOMACY`, `ESCORT`, `ALLOWED_PARENTS`
- Produces: `<India/>` network + escort reveal; `<Brics/>` finale; `embed.js` Infogram-style loader

- [ ] **Step 1: Write failing test**

```tsx
// tests/india-brics.test.tsx
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import India from "../src/chapters/India";
import Brics from "../src/chapters/Brics";
describe("india-brics", () => {
  it("escort data reveal", () => {
    const h = renderToString(<India />);
    expect(h).toContain("Nanda Devi"); expect(h).toContain("85,000");
  });
  it("brics finale asks decision", () => {
    expect(renderToString(<Brics />)).toMatch(/RIGHT TO DECIDE|BRICS/);
  });
});
```

```ts
// tests/embed.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
describe("embed", () => {
  it("embed.js posts resize safely", () => {
    const s = fs.readFileSync("public/embed.js", "utf8");
    expect(s).toContain("IMMERSIVE_RESIZE");
    expect(s).toContain("montreux-temptation");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/india-brics.test.tsx tests/embed.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

`India.tsx`: Washington–Delhi–Tehran SVG net; Mar12 + 3 calls animate; escort route Nanda Devi/Shivalik exits; DataReveal 85kt + "first cargo … almost two weeks"; Fathali quote; Jaishankar "not blanket arrangement"; Saraswat arithmetic; Stubb quote; tightrope → NOT NEUTRALITY / RIGHT TO DECIDE.
`Brics.tsx`: camera Hormuz→Delhi; Sep12-13 Bharat Mandapam; Sidr +12 days, 19 dead; Nehru 1961 → RIGHT TO DECIDE → WILL INDIA USE THAT RIGHT…? + credits (Banerjee/CNN-News18).
`public/embed.js`:
```js
(function(){
  var SRC="https://montreux-temptation.vercel.app/?embed=true";
  function init(){
    document.querySelectorAll(".news18-immersive,.immersive-embed").forEach(function(el){
      if(el.dataset.mounted) return; el.dataset.mounted="1";
      var f=document.createElement("iframe");
      f.src=SRC; f.style.width="100%"; f.style.border="0"; f.style.display="block";
      f.setAttribute("scrolling","no"); f.setAttribute("loading","lazy");
      f.title="The Montreux Temptation";
      el.appendChild(f);
    });
  }
  window.addEventListener("message",function(e){
    if(e.origin!=="https://montreux-temptation.vercel.app") return;
    if(e.data&&e.data.type==="IMMERSIVE_RESIZE"){
      document.querySelectorAll(".news18-immersive iframe,.immersive-embed iframe").forEach(function(f){
        f.style.height=e.data.height+"px";
      });
    }
  });
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
```
`App.tsx`: wire all 7 chapters in order + progress + resize.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test; npm run build`
Expected: PASS + build clean

- [ ] **Step 5: Commit + deploy**

```bash
git add -A; git commit -m "feat: india brics embed loader"
vercel --prod
```

Day-1 CMS probe before polish: deploy Task 1-3 shell first, confirm News18 preserves iframe/script + CSP allows Vercel, then finish cinematic tasks.
