import Image from "next/image";
import { INSTALL_CMD } from "../content";
import CopyButton from "../CopyButton";
import Faq from "../sections/Faq";
import { Buttons } from "./Hero";
import s from "./mac.module.css";
import Window from "./Window";

// Questions in one window, then the download in another, with the one-line install.
export default function Close() {
  return (
    <>
      <section id="faq" className={s.faq} aria-labelledby="faq-h">
        <p className={s.pill}>questions</p>
        <div data-reveal>
          <Window tint="blue" title="questions.txt">
            <div className={s.faqBody}>
              <h2 id="faq-h" className={s.srOnly}>
                Questions
              </h2>
              <Faq />
            </div>
          </Window>
        </div>
      </section>

      <section id="download" className={s.get} aria-labelledby="download-h">
        <div data-reveal>
          <Window tint="teal" title="install">
            <div className={s.getBody}>
              <Image src="/art/fork-icon.png" width={72} height={72} alt="" />
              <h2 id="download-h" className={s.getTitle}>
                get Fork
              </h2>
              <p className={s.getLine}>free. for macs with apple silicon. signed and notarized by apple.</p>
              <Buttons from="download" />
              <div className={s.install}>
                <code>$ {INSTALL_CMD}</code>
                <CopyButton text={INSTALL_CMD} event="install_copied" label="Copy the install command" />
              </div>
            </div>
          </Window>
        </div>
      </section>
    </>
  );
}
