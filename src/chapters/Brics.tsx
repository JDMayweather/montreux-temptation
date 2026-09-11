import React from "react";
import Figure from "../components/Figure";

const DELHI_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/b/b0/Bharat_Mandapam_Morning_View.jpg";

export default function Brics(): React.JSX.Element {
  return (
    <section className="chapter chapter-brics" id="brics" data-num="07">
      <p>The 18th BRICS Summit meets in New Delhi on September 12 and 13, at Bharat Mandapam, under India’s chairmanship this year. The leaders of Iran’s largest trading partners, and Iran itself, will be in the same city, 12 days after the Saudi-flagged Sidr was hit, and in the same week that the verified seafarer death toll crossed 19.</p>
      <Figure
        src={DELHI_SRC}
        alt="Bharat Mandapam convention centre in New Delhi"
        caption="Bharat Mandapam, New Delhi."
        credit="Photo: Ministry of Culture / PIB Photo Division, Govt. of India (GODL-India), via Wikimedia Commons"
      />
      <p>Raisina Hill has not said whether or not Hormuz will be raised.</p>
      <p>India, today, stands at a precipice and a critical juncture in global politics and diplomacy. It started, of course, with the path of non-alignment in 1961, championed by then Prime Minister Jawaharlal Nehru, and led in alliance with Yugoslavia, Egypt, Indonesia, and Ghana. What started in 1961 as a refusal to join either bloc serves as the bedrock for every diplomatic play made by India since.</p>
      <p>What Nehru built in 1961 was never really about neutrality. It was about the right to decide. That instinct is still there. All that remains to be seen, is whether the outcome of the 18th BRICS summit will usher in an era of lasting peace for West Asia.</p>
    </section>
  );
}
