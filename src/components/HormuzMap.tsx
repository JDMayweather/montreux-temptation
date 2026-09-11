interface HormuzMapProps {
  activeIndex: number;
  layers: Record<string, boolean>;
}

// Phase drives what the map shows. Index maps to TIMELINE order:
// 0 Feb28 closure, 1 Apr11-12 talks fail, 2 Apr13 blockade, 3 May05 PGSA,
// 4 Jun17 memorandum, 5 Jul08 strikes, 6 Jul14 reimposed, 7 Aug31 Sidr, 8 toll stands.
function phaseFor(index: number) {
  if (index <= 0) return { blockade: false, attacks: false, gate: false, open: true, status: "Iran closed the Strait of Hormuz within hours." };
  if (index === 1) return { blockade: false, attacks: false, gate: false, open: true, status: "Talks in Islamabad on April 11 and 12 failed." };
  if (index === 2) return { blockade: true, attacks: false, gate: false, open: false, status: "The United States imposed a naval blockade on Iranian ports on April 13." };
  if (index === 3) return { blockade: true, attacks: false, gate: true, open: false, status: "Iran formed the Persian Gulf Strait Authority on May 5, a new body to issue transit permits and collect fees from ships passing through." };
  if (index === 4) return { blockade: false, attacks: false, gate: false, open: true, status: "The Islamabad Memorandum, signed June 17, gave Iran 60 days to allow toll-free passage." };
  if (index === 5) return { blockade: false, attacks: true, gate: true, open: false, status: "On July 8, Iran struck commercial vessels transiting the Strait." };
  if (index === 6) return { blockade: true, attacks: true, gate: true, open: false, status: "The United States struck back and reimposed its blockade on July 14." };
  if (index === 7) return { blockade: true, attacks: true, gate: true, open: false, status: "The Saudi tanker Sidr was hit on August 31, killing two Filipino crew members." };
  return { blockade: false, attacks: false, gate: true, open: false, status: "The International Maritime Organization has verified seventy attacks on commercial ships and at least nineteen seafarer deaths since the war began." };
}

export default function HormuzMap({ activeIndex, layers }: HormuzMapProps) {
  const phase = phaseFor(activeIndex);
  const showBlockade = layers.blockade && phase.blockade;
  const showAttacks = layers.attacks && phase.attacks;
  const showGate = layers.shipping !== false && phase.gate;
  const showDiplomacy = layers.diplomacy && (activeIndex === 1 || activeIndex === 4);
  const routeColor = phase.open ? "#e0862a" : "#c0392b";
  const trafficOpacity = phase.open ? 1 : 0.25;
  return (
    <div style={{ position: "relative" }}>
      <style>{`
        .hz-route { animation: hz-dash 2.4s linear infinite; }
        @keyframes hz-dash { to { stroke-dashoffset: -28; } }
        @keyframes hz-ping { 0% { opacity: 0.9; } 100% { opacity: 0; } }
        .hz-ping { animation: hz-ping 1.8s ease-out infinite; transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) {
          .hz-route, .hz-ping { animation: none !important; }
        }
      `}</style>
      <svg viewBox="0 0 640 360" role="img" aria-label="Strait of Hormuz map" style={{ width: "100%", height: "auto", display: "block", background: "#0b1622", border: "1px solid #1d2735" }}>
        {/* Iran coastline (jagged, schematic) */}
        <path d="M0,0 H640 V96 L560,110 L470,96 L380,118 L290,100 L200,120 L110,104 L0,116 Z" fill="#1c2b3a" />
        <text x="24" y="40" fill="#7e93a8" fontSize="16" letterSpacing="3">IRAN</text>
        {/* Oman / Musandam peninsula */}
        <path d="M0,360 H640 V268 L540,256 L460,276 L360,260 L260,278 L150,262 L0,276 Z" fill="#233140" />
        <text x="24" y="326" fill="#7e93a8" fontSize="16" letterSpacing="3">OMAN</text>
        {/* water labels */}
        <text x="30" y="200" fill="#54687e" fontSize="11" letterSpacing="2">PERSIAN GULF</text>
        <text x="492" y="200" fill="#54687e" fontSize="11" letterSpacing="2">GULF OF OMAN</text>
        <text x="272" y="152" fill="#8a99ab" fontSize="11" letterSpacing="2">STRAIT OF HORMUZ ↓</text>

        {/* shipping route */}
        {layers.shipping !== false && (
          <path
            className="hz-route"
            d="M -10 210 C 140 200, 220 180, 330 195 S 520 220, 650 205"
            fill="none"
            stroke={routeColor}
            strokeWidth="2.5"
            strokeDasharray="8 6"
            opacity={trafficOpacity}
          />
        )}
        {/* PGSA permit gate */}
        {showGate && (
          <g>
            <line x1="330" y1="160" x2="330" y2="230" stroke="#e0862a" strokeWidth="2.5" />
            <rect x="292" y="132" width="76" height="22" fill="#e0862a" />
            <text x="330" y="147" fill="#07090d" fontSize="11" fontWeight="700" textAnchor="middle">PERMIT GATE</text>
          </g>
        )}
        {/* blockade zone */}
        {showBlockade && (
          <g>
            <ellipse cx="330" cy="195" rx="110" ry="40" fill="rgba(192,57,43,0.16)" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x="330" y="199" fill="#e88" fontSize="11" letterSpacing="2" textAnchor="middle">BLOCKADE — ROUTE CHOKED</text>
          </g>
        )}
        {/* attack markers Jul 08 / Aug 31 */}
        {showAttacks && (
          <g fill="none" stroke="#e0862a" strokeWidth="2">
            <circle cx="250" cy="182" r="10" opacity="0.9">
              <animate attributeName="r" values="6;22" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="430" cy="200" r="10" opacity="0.9">
              <animate attributeName="r" values="6;22" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="250" cy="182" r="4" fill="#e0862a" stroke="none" />
            <circle cx="430" cy="200" r="4" fill="#e0862a" stroke="none" />
            <text x="228" y="162" fill="#f0b26b" fontSize="12">Jul 08</text>
            <text x="408" y="240" fill="#f0b26b" fontSize="12">Aug 31</text>
          </g>
        )}
        {/* traffic dots fade with activeIndex */}
        {layers.shipping !== false && (
          <g fill="#e8c87a" opacity={trafficOpacity}>
            <circle cx="120" cy="196" r="3" />
            <circle cx="300" cy="186" r="3" />
            <circle cx="500" cy="200" r="3" />
          </g>
        )}
        {showDiplomacy && (
          <g>
            <line x1="120" y1="250" x2="520" y2="150" stroke="#8fd0ff" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.9" />
            <text x="330" y="242" fill="#8fd0ff" fontSize="12" textAnchor="middle">diplomacy corridor — talks route</text>
          </g>
        )}
      </svg>
      <p aria-live="polite" style={{ margin: "0.6rem 0 0", fontSize: "0.95rem", color: "#f2ede4", borderLeft: "3px solid #e0862a", paddingLeft: "0.6rem" }}>
        {phase.status}
      </p>
    </div>
  );
}
