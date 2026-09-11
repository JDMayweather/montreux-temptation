export interface TimelineEvent {
  date: string;
  title: string;
  body: string;
  layer?: "shipping" | "attacks" | "blockade" | "diplomacy";
}

// All titles and bodies are verbatim clauses from the article text.
export const TIMELINE: TimelineEvent[] = [
  { date: "Feb 28, 2026", title: "Operation Epic Fury and Rising Lion", body: "On February 28, 2026, the United States and Israel launched Operation Epic Fury and Rising Lion respectively, a joint strike campaign that killed Iran\u2019s Supreme Leader Ali Khamenei. Iran closed the Strait of Hormuz within hours.", layer: "shipping" },
  { date: "Apr 11\u201312", title: "Talks in Islamabad", body: "Talks in Islamabad on April 11 and 12 failed.", layer: "diplomacy" },
  { date: "Apr 13", title: "A naval blockade", body: "The United States imposed a naval blockade on Iranian ports on April 13.", layer: "blockade" },
  { date: "May 05", title: "The Persian Gulf Strait Authority", body: "Iran formed the Persian Gulf Strait Authority on May 5, a new body to issue transit permits and collect fees from ships passing through.", layer: "shipping" },
  { date: "Jun 17", title: "The Islamabad Memorandum", body: "Pakistan brokered a way out. The Islamabad Memorandum, signed June 17, gave Iran 60 days to allow toll-free passage. The United States lifted its blockade the next day.", layer: "diplomacy" },
  { date: "Jul 08", title: "Iran struck commercial vessels", body: "The deal lasted three weeks short of its term. On July 8, Iran struck commercial vessels transiting the Strait.", layer: "attacks" },
  { date: "Jul 14", title: "The blockade reimposed", body: "The United States struck back and reimposed its blockade on July 14.", layer: "blockade" },
  { date: "Aug 31", title: "The Saudi tanker Sidr", body: "Attacks on shipping have not stopped since. The Saudi tanker Sidr was hit on August 31, killing two Filipino crew members.", layer: "attacks" },
  { date: "Early Sep", title: "Seventy attacks", body: "The International Maritime Organization has verified seventy attacks on commercial ships and at least nineteen seafarer deaths since the war began.", layer: "shipping" },
];

export const DIPLOMACY = [
  { date: "Mar 12", event: "Prime Minister Narendra Modi called Iranian President Masoud Pezeshkian on March 12." },
  { date: "Following weeks", event: "External Affairs Minister S. Jaishankar held three phone calls with his Iranian counterpart, Abbas Araghchi, in the weeks that followed." },
  { date: "+2 days", event: "Within two days of the Modi-Pezeshkian call, the India-flagged carriers MT Nanda Devi and MT Shivalik exited the Strait under Indian Navy escort." },
];

export const ESCORT = {
  ships: ["MT Nanda Devi", "MT Shivalik"],
  cargo: "close to 85,000 metric tonnes of LPG",
  note: "the first cargo of any flag to move through the Strait in almost two weeks",
};

export { MONTREUX_ROWS } from "./montreux";
export type { MontreuxRow } from "./montreux";
