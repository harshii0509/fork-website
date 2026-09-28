import type { Metadata } from "next";
import Footer from "../Footer";
import NoodleBowl from "../NoodleBowl";
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

export default function WhatsCooking() {
  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <BackButton />

        <div className={styles.titleRow}>
          <NoodleBowl className={styles.bowl} />
          <h1 className={styles.title}>What’s cooking</h1>
        </div>
        <p className={styles.intro}>
          Everything that’s gone into Fork, freshest first. What changed, when it landed, and why it was made.
          Updated with every change, big or small.
        </p>
      </header>

      <main>
        <Kitchen entries={ENTRIES} releases={RELEASES} />
        <div className={styles.end}>
          <p className={styles.endNote}>That’s everything so far. More soon.</p>
          <BackButton />
        </div>
      </main>

      <Footer className={styles.footer} />
    </div>
  );
}
