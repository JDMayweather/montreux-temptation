import React from "react";
import Figure from "../components/Figure";

const SHIVALIK_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/8/8f/INS_Shivalik_F-47_during_joint_operations_with_U.S._Navy_%28200720-N-KO930-1027%29.jpg";

const TANKER_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/c/c0/Atlas_Maritime%27s_Mitera_Marigo_Aframax_Oil_Tanker.jpg";

export default function India(): React.JSX.Element {
  return (
    <section className="chapter chapter-india" id="india" data-num="06">
      <h2>How Does India Fit Into This Ballgame?</h2>
      <p>A convention, needs more than a text. It needs a guarantor, a country that both sides will accept holding the pen.</p>
      <p>Pakistan has already tried its hand at Hormuz diplomacy, and the deal it built collapsed in less than three weeks. This remark is not to throw shade or tarnish Islamabad. It means, whoever tries next needs a global standing, and reputation that survives contact with both Washington and Tehran, and India have spent the last six months quietly building exactly that.</p>
      <p>Back in March, when 28 Indian-flagged ships and roughly 800 Indian seafarers sat stranded in the Strait, South Block did not join the international condemnation aimed at Washington or Tel Aviv. Nor did it stay entirely silent.</p>
      <p>Prime Minister Narendra Modi called Iranian President Masoud Pezeshkian on March 12. External Affairs Minister S. Jaishankar held three phone calls with his Iranian counterpart, Abbas Araghchi, in the weeks that followed.</p>
      <Figure
        src={SHIVALIK_SRC}
        alt="Indian Navy frigate INS Shivalik under way at sea"
        caption="INS Shivalik at sea."
        credit="Photo: U.S. Navy / MC3 Olivia Banmally Nichols (public domain), via Wikimedia Commons"
      />
      <p>Within two days of the Modi-Pezeshkian call, the India-flagged carriers MT Nanda Devi and MT Shivalik exited the Strait under Indian Navy escort, carrying close to 85,000 metric tonnes of LPG between them, the first cargo of any flag to move through the Strait in almost two weeks. Iran’s ambassador to India, Mohammad Fathali, elucidated, “Yes, because India is our friend.” “We believe that Iran and India share common interests in the region.”</p>

      <p>Dr. Jaishankar did not let the moment run away from him. He told the Financial Times that the passage was not a “blanket arrangement,” and denied it was any kind of quid pro quo. India was also not on the list of nations Washington asked to join a multinational naval coalition to secure the Strait. It was not among the countries publicly declining the request either.</p>
      <p>“The price of anything is the amount of life you exchange for it” — Henry David Thoreau</p>
      <p>Dr. Deepika Saraswat, associate fellow at the Manohar Parrikar Institute for Defence Studies and Analyses, calls India’s approach arithmetic rather than caution. “It’s a cost-benefit analysis,” she told CNN-News18. “You look at where your bigger interests lie and what kind of manoeuvre is possible.”</p>
      <p>At the Raisina Dialogue in New Delhi this year, Finnish President Alexander Stubb said what very few governments have. “We need a ceasefire. I’m wondering if India can actually get involved,” he said, then added, “I believe personally that we should all become a little bit more Indian.”</p>
      <p>That is a European head of state, from a country that borders Russia and has spent four years recalibrating its own foreign policy entirely, telling the world that India’s tightrope walk is not a liability. That the phone calls burning through midnight oil, the Navy outside the Strait, and the studied silences, are precisely the kind of diplomacy the current moment demands.</p>
    </section>
  );
}
