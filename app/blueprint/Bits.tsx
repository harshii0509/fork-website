"use client";

import { useState } from "react";
import ForkWindow from "../v2/fork/ForkWindow";
import { FAQ } from "../v2/content";
import styles from "./blueprint.module.css";

// The Blueprint direction's interactive bits: the light/dark switch over a Fork window, and the questions.

const LOOKS = [
  ["light", "Light"],
  ["dark", "Dark"],
  ["system", "System"],
] as const;

export function Looks() {
  const [look, setLook] = useState<(typeof LOOKS)[number][0]>("system");
  return (
    <>
      <div className={styles.seg} role="radiogroup" aria-label="Try Fork in light or dark">
        {LOOKS.map(([key, name]) => (
          <button key={key} role="radio" aria-checked={key === look} onClick={() => setLook(key)} data-track="theme_tried" data-item={name} data-from="yours">
            {name}
          </button>
        ))}
      </div>
      <ForkWindow mode={look === "system" ? undefined : look} label={`The Fork window in ${look === "system" ? "your Mac’s" : look} mode`} />
    </>
  );
}

// One answer open at a time; the first starts open.
export function Questions() {
  const [open, setOpen] = useState(0);
  return (
    <ol className={styles.faq}>
      {FAQ.map((f, i) => (
        <li key={f.q} data-open={open === i || undefined}>
          <button
            aria-expanded={open === i}
            aria-controls={`bp-faq-${i}`}
            onClick={() => setOpen(open === i ? -1 : i)}
            data-track={open === i ? undefined : "faq_opened"}
            data-item={String(i + 1)}
            data-from="faq"
          >
            <span className={styles.qn}>Q{i + 1}</span>
            {f.q}
            <span className={styles.plus} aria-hidden />
          </button>
          <div id={`bp-faq-${i}`} className={styles.answer} role="region">
            <div>
              <p>{f.a}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
