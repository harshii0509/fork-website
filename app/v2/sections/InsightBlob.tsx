"use client";

import { useRef } from "react";
import Bloub from "../Bloub";
import { BLOB_LOOKS } from "../content";
import { useInView, useLoop } from "../hooks";
import styles from "../v2.module.css";

// The giant blob peeking into the insight panel, going through the looks a tab's blob has in Fork.
const STEPS = [2600, 2800, 2600, 2800, 3000] as const;

export default function InsightBlob() {
  const ref = useRef<HTMLDivElement>(null);
  const i = useLoop(STEPS, useInView(ref));
  const look = BLOB_LOOKS[i];
  return (
    <div ref={ref} className={styles.bigBlob}>
      <span className={styles.statePill} aria-live="polite">
        <i data-look={look.key} />
        {look.label}
      </span>
      <Bloub size={440} state={look.state} expression={look.expression} color={look.bad ? "#e5484d" : "#7c6cff"} />
      <span className={styles.confetti} aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
