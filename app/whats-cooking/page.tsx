import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import DownloadButton from "../DownloadButton";
import { DOWNLOAD } from "../v2/content";
import Footer from "../v2/Footer";
import Nav from "../v2/Nav";
import Figure from "../v2/hairline/Figure";
import v2 from "../v2/v2.module.css";
import BackButton from "./BackButton";
import { ENTRIES, RELEASES } from "./entries";
import Kitchen from "./Kitchen";
import styles from "./cooking.module.css";

const title = "What’s cooking in Fork";
const description = "Everything that’s gone into Fork, freshest first: what changed, when, and why.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
};

const plex = IBM_Plex_Mono({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-plex" });

// In the home page's greys: the title and tally on a panel, with the latest version drawn in light lines.
export default function WhatsCooking() {
  const onStove = ENTRIES.filter((e) => e.where === "app" && !e.version).length;
  const latest = RELEASES[0]?.version.replace(/\.0$/, "") ?? "1";
  return (
    <div className={`${v2.v2} ${plex.variable}`}>
      <Nav brandClass={plex.className} away />

      <header className={styles.top}>
        <div className={styles.band}>
          <div className={styles.bandCopy}>
            <h1 className={`${v2.h1} ${styles.title}`}>What’s cooking</h1>
            <p className={styles.intro}>
              Everything that’s gone into Fork, freshest first. What changed, when it landed, and why it was made. Updated
              with every change, big or small.
            </p>
            <p className={styles.tally}>
              <span>
                <b>{ENTRIES.length}</b> things cooked so far
              </span>
              {onStove > 0 && (
                <span className={styles.tallyStove}>
                  <b>{onStove}</b> still on the stove
                </span>
              )}
            </p>
          </div>
          <Figure name="numerals" digits={latest} className={styles.numerals} label={`Fork ${latest}, the latest version, as a drawing: point at a digit and it lifts.`} />
        </div>
      </header>

      <main className={styles.main}>
        <Kitchen entries={ENTRIES} releases={RELEASES} />
        <div className={styles.end}>
          <p className={styles.endNote}>That’s everything so far. More soon.</p>
          <div className={styles.endCtas}>
            <DownloadButton href={DOWNLOAD} from="cooking-end" className={v2.btnPrimary} />
            <BackButton />
          </div>
        </div>
      </main>

      <Footer at="cooking" />
    </div>
  );
}
