import React from "react";
import Figure from "../components/Figure";
import { MONTREUX_ROWS } from "../data/montreux";

const BOSPHORUS_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/d/d5/Bosphorus_aerial_view.jpg";

export default function Montreux(): React.JSX.Element {
  return (
    <section className="chapter chapter-montreux" id="montreux" data-num="03">
      <h2>Montreux. An “Out Of The Box” Answer</h2>
      <Figure
        src={BOSPHORUS_SRC}
        alt="Aerial view of the Bosphorus strait"
        caption="The Bosphorus."
        credit="Photo: Adbar, CC BY-SA 3.0, via Wikimedia Commons"
      />
      <p>Back in 1936, before World War 2 started, Turkey wanted the same thing that Iran wants now — the right to charge for passage through its straits. The Montreux Convention gave it that right, but on narrow terms. Article 2 permits Turkey to charge only for three specific services: sanitary inspection, lighthouses and buoys, and life-saving stations. Annex I fixes the rate per net ton for each. The current rate is $6.70 per net ton. No service, no charge. Any discount Turkey grants has to apply to every flag equally.</p>
      <p>The Persian Gulf Strait Authority under Iran does not work in the same manner. It is a permit system, not a published tariff. Ships apply, and pay, for the right to pass, but not for a named rendered service.</p>
      <div className="cards">
        <article className="card card-1936">
          <h3>Turkey 1936</h3>
          <dl>
            {MONTREUX_ROWS.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.turkey1936}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="card card-2026">
          <h3>Iran 2026</h3>
          <dl>
            {MONTREUX_ROWS.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.iran2026}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
      <p>As of early September, the PGSA’s own compliance list carried fifty-seven vessels marked as non-compliant, but that is the exact kind of distinction that a flag-blind framework with international ratification like “Montreux” does not allow.</p>
    </section>
  );
}
