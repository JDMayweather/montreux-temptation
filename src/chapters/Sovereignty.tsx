import React from "react";
import Figure from "../components/Figure";

const HORMUZ_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/a/aa/STS004-37-716_-_Strait_of_Hormuz.jpg";

const TANKER_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/c/c0/Atlas_Maritime%27s_Mitera_Marigo_Aframax_Oil_Tanker.jpg";

export default function Sovereignty(): React.JSX.Element {
  return (
    <section className="chapter chapter-sovereignty" id="sovereignty" data-num="05">
      <p>Coastal states carry the cost of keeping a strait safe, patrol boats, wreck removal, environmental cleanup after a spill, search and rescue when a tanker catches fire, while the tonnage moving through it, and the profit on that tonnage, belongs almost entirely to shipowners, insurers, and the economies receiving the cargo at the other end. Through this eyepiece, Iran might not be inventing a toll just out of spite but is maybe asking to be paid for a burden that is not entirely its to shoulder.</p>
      <Figure
        src={HORMUZ_SRC}
        alt="The Strait of Hormuz photographed from orbit, ship wakes visible"
        caption="The Strait of Hormuz."
        credit="Photo: NASA (public domain), via Wikimedia Commons"
      />
      <p>Another view would treat the phrase “freedom of navigation operations” or FONOP as it’s called — as doing less legal work than it claims. Countries like the United States have used it to justify keeping the US Fifth Fleet stationed at the edge of Iranian waters, and the Seventh Fleet in the South China Sea.</p>
      <p>A strait that a superpower can enter with warships whenever it judges that the moment requires it is not neutral water. It is a passage being held open by force, and FONOP becomes the language used to describe that arrangement rather than to question it. A transit fee, in this reading, would not be a violation of that freedom. It would rather serve as one of the few economic tools a state like Iran has left, after sanctions have closed most others, and to make national sovereignty over its own coastline mean something.</p>
      <Figure
        src={TANKER_SRC}
        alt="Oil tanker under way at sea"
        caption="An oil tanker at sea."
        credit="Photo: Pennykall, CC BY-SA 3.0, via Wikimedia Commons"
      />
      <p>None of these settle as to whether a fee built this way would survive a challenge at the United Nations. It, however, does explain why Tehran has no reason to abandon the toll simply because the Persian Gulf Strait Authority’s current version is legally sloppy. The stronger the sovereignty argument underneath it, the more reason there will be to build a version that can hold up under global scrutiny. That is the case for a convention, a new one, for the Strait of Hormuz.</p>
    </section>
  );
}
