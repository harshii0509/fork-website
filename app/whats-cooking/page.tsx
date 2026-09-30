import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import DownloadButton from "../DownloadButton";
import Footer from "../Footer";
import NoodleBowl from "../NoodleBowl";
import { DOWNLOAD } from "../v2/content";
import Nav from "../v2/Nav";
import ShaderPanel from "../v2/ShaderPanel";
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

// In the v2 look: cream paper, flat cards, and one soft shader behind the title.
export default function WhatsCooking() {
  const onStove = ENTRIES.filter((e) => e.where === "app" && !e.version).length;
  return (
    <div className={`${v2.v2} ${plex.variable}`}>
      <Nav brandClass={plex.className} away />

      <header className={styles.top}>
        <ShaderPanel
          shader="GrainGradient"
          base="#EAE3D5"
          className={styles.band}
          steer={0.08}
          params={{
            colorBack: "#EDE7DA",
            colors: ["#D8D1FB", "#F0CAD6", "#F3E1B0"], // pale, so the words on top stay easy to read
            softness: 1,
            intensity: 0.2,
            noise: 0.2,
            shape: "corners",
            speed: 0.3,
          }}
        >
          <NoodleBowl className={styles.bowl} />
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
        </ShaderPanel>
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

      <Footer className={v2.footer} />
    </div>
  );
}
