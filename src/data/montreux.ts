export interface MontreuxRow {
  label: string;
  turkey1936: string;
  iran2026: string;
}

// Every cell is a verbatim clause from the article's Montreux section.
export const MONTREUX_ROWS: MontreuxRow[] = [
  {
    label: "What is charged for",
    turkey1936: "Only for three specific services: sanitary inspection, lighthouses and buoys, and life-saving stations (Article 2)",
    iran2026: "Ships apply, and pay, for the right to pass, but not for a named rendered service",
  },
  {
    label: "Rate",
    turkey1936: "Annex I fixes the rate per net ton for each. The current rate is $6.70 per net ton. No service, no charge.",
    iran2026: "A permit system, not a published tariff",
  },
];
