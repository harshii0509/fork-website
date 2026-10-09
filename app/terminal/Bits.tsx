"use client";

import { useState } from "react";
import ForkWindow from "../v2/fork/ForkWindow";
import { FAQ } from "../v2/content";
import styles from "./terminal.module.css";

// The Terminal direction's interactive bits: appearance flags over a Fork window, and the questions as --help.

const LOOKS = ["light", "dark", "system"] as const;

export function Looks() {
  const [look, setLook] = useState<(typeof LOOKS)[number]>("dark");
  return (
    <>
      <div className={styles.flags} role="radiogroup" aria-label="Try Fork in light or dark">
        {LOOKS.map((key) => (
          <button key={key} role="radio" aria-checked={key === look} onClick={() => setLook(key)} data-track="theme_tried" data-item={key} data-from="yours">
            --{key}
          </button>
        ))}
      </div>
      <ForkWindow mode={look === "system" ? undefined : look} label={`The Fork window in ${look === "system" ? "your Mac’s" : look} mode`} />
    </>
  );
}

export function Questions() {
  const [open, setOpen] = useState(0);
  return (
    <dl className={styles.help}>
      {FAQ.map((f, i) => (
        <div key={f.q} data-open={open === i || undefined}>
          <dt>
            <button
              aria-expanded={open === i}
              aria-controls={`t-faq-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
              data-track={open === i ? undefined : "faq_opened"}
              data-item={String(i + 1)}
              data-from="faq"
            >
              <span className={styles.flag}>{open === i ? "−" : "+"} q{i + 1}</span>
              {f.q}
            </button>
          </dt>
          <dd id={`t-faq-${i}`} hidden={open !== i}>
            {f.a}
          </dd>
        </div>
      ))}
    </dl>
  );
}
