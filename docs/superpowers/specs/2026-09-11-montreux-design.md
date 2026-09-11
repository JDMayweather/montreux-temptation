# The Montreux Temptation — Immersive Design Spec (2026-09-11)

## 1. Source
- Docx: `C:\Users\siddh\Downloads\The Montreux Temptation.docx`, 44 paras, 0 tables
- Title: The Montreux Temptation: Can Iran Turn Hormuz Into A Treaty-Governed Toll Strait?
- Byline: Anoshito Banerjee
- Decisions: Arch=A-hybrid (SVG primary, Three.js hero-only lazy), Stack=React+TS+Vite on Vercel, Scope=full 7-chapter build

## 2. Architecture
- Vite + React + TypeScript SPA, two modes: standalone `/`, embed `/?embed=true` (trims nav/branding/footer)
- Story engine: GSAP + ScrollTrigger primary; Lenis smooth scroll (disabled in embed + reduced-motion)
- Maps: inline SVG primary (Hormuz, Bosphorus/Dardanelles morph, blockade layers); Three.js hero particles only, lazy via React.lazy + IntersectionObserver
- No MapLibre in V1 (cost/payload/CMS risk); SVG gives morph metaphor without tiles
- Data: `src/data/articleData.ts` — timeline events, PGSA vs Montreux rows, diplomacy calls, escort data, BRICS meta
- Chapters: `src/chapters/{Hero,Question,WarTimeline,Montreux,TollTest,Sovereignty,India,BRICS}/`

## 3. Chapter map (paras → scenes)
1. Hero: black → Gulf outline → ship lights → MONTREUX 1936 ↓ HORMUZ 2026 morph (Bosphorus→Hormuz)
2. The Question (para 2-10): newsroom fragments → "Bosphorus" / "Dardanelles" / "1936" → hook freeze: "why was Iran doing such a bad job of it?" → embassy beat (5 Barakhamba, tea Aug 25, no talking points)
3. War Timeline (para 11-16): map-as-timeline — Feb28 Epic Fury/Rising Lion + Hormuz closes → Apr11-12 Islamabad fail → Apr13 US blockade → May05 PGSA → Jun17 Memorandum (60-day toll-free) → Jul08 strikes → Jul14 blockade reimposed → Aug31 Sidr (2 Filipino dead) + IMO 70 attacks / 19 dead. Layers: shipping/attacks/blockade/diplomacy
4. Montreux vs PGSA (para 18-21): split world Turkey 1936 vs Iran 2026; Montreux Art2 3 services + Annex I $6.70/net ton, flag-blind; PGSA permit/right-to-pass, 57 non-compliant list
5. Survivable Toll + Sovereignty (para 21-26): 5-test diagram (service? defined? equal? recognized? survives UN?) → IRAN model fractures; tanker econ flow (profits up, patrol/wreck/spill/SAR costs down) → "WHO PAYS FOR THE STRAIT?"; FONOP → Fifth/Seventh Fleet → "WHO DEFINES FREEDOM?"
6. India Guarantor (para 28-37): diode network Washington–Delhi–Tehran; Mar12 Modi-Pezeshkian, Jaishankar-Araghchi x3, 28 ships/800 seafarers; escort MT Nanda Devi + Shivalik, 85kt LPG, first cargo in ~2 weeks; Fathali "India is our friend"; Jaishankar "not blanket arrangement"; Thoreau quote; Saraswat arithmetic; Stubb Raisina "be a little more Indian"; tightrope → "NOT NEUTRALITY / RIGHT TO DECIDE"
7. BRICS Finale (para 38-41): Hormuz→West Asia→India→Delhi camera; Sep12-13 Bharat Mandapam; 12 days after Sidr, death toll 19; non-alignment 1961 Nehru → "RIGHT TO DECIDE" → "WILL INDIA USE THAT RIGHT TO WRITE NEXT RULES OF HORMUZ?" + credits

## 4. Components
- ScrollySection, ProgressIndicator, AnimatedSVGMap, WarTimeline, SplitCompare, TollTest, SovereigntyFlow, FonopMap, DiplomaticNet, EscortSequence, DataReveal, BricsFinale
- Shared: useEmbed(), useReducedMotion(), useResizePostMessage()

## 5. Embed (Vercel → News18 CMS)
- Prod: `https://montreux-temptation.vercel.app/?embed=true`; standalone for review
- V1 snippet: iframe `.immersive-frame` + parent listener validates origin, sets height from `IMMERSIVE_RESIZE`
- V2: `embed.js` finds `.news18-immersive[data-id]`, injects iframe, auto-resize (Infogram-style)
- Inside: ResizeObserver → postMessage height to allowlisted parents (news18.com, www.news18.com); no `*` in prod
- Vercel headers: CSP `frame-ancestors 'self' https://www.news18.com https://news18.com`; no `X-Frame-Options: DENY`
- Test early: CMS preserves script/iframe? CSP blocks Vercel? fallback = direct iframe + global resize listener

## 6. Perf / mobile / a11y
- <3MB critical; lazy maps/WebGL/charts; React.lazy + dynamic import
- Mobile: scroll-first, tap not hover, simplified SVG, no heavy WebGL
- `prefers-reduced-motion`: disable Lenis/GSAP cinematics; full text readable sans-animation; keyboard nav; alt text for viz; contrast-safe
- No animation without narrative question (table in prompt §28)

## 7. Testing
- Local → Vercel preview → prod; CMS embed test day-1 before heavy scenes
- Matrix: Chrome/Safari mobile, slow net, reduced-motion, standalone vs embed, resize loop check
- Content verification: dates/names/figures match docx paras exactly

## 8. Out of scope V1
- MapLibre tiles, full Three.js scenes per chapter, CMS-injected React (iframe only), JSON-driven generic engine (hooks only, second story later)
