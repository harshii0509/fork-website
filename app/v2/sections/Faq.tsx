"use client";

import { useState } from "react";
import { FAQ } from "../content";
import styles from "../v2.module.css";

// One answer open at a time; the first starts open.
export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className={styles.faqList}>
      {FAQ.map((f, i) => (
        <div key={f.q} className={styles.faqItem} data-open={open === i || undefined}>
          <h3>
            <button
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
              data-track={open === i ? undefined : "faq_opened"}
              data-item={String(i + 1)}
              data-from="faq"
            >
              {f.q}
              <span className={styles.faqIcon} aria-hidden />
            </button>
          </h3>
          <div id={`faq-${i}`} className={styles.faqA} role="region">
            <div>
              <p>{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
