"use client";

import { useState } from "react";
import ForkWindow from "../fork/ForkWindow";
import styles from "../v2.module.css";

// Light, Dark or System, as in Fork's Settings → Appearance: the window below takes the one you pick.
const LOOKS = [
  ["light", "Light"],
  ["dark", "Dark"],
  ["system", "System"],
] as const;

export default function Themes() {
  const [look, setLook] = useState<(typeof LOOKS)[number][0]>("system");
  return (
    <>
      <div className={styles.swatches} role="radiogroup" aria-label="Try Fork in light or dark" data-reveal>
        {LOOKS.map(([key, name]) => (
          <button
            key={key}
            role="radio"
            aria-checked={key === look}
            className={styles.swatch}
            onClick={() => setLook(key)}
            data-track="theme_tried"
            data-item={name}
            data-from="yours"
          >
            <span className={styles.swatchDot} data-look={key} />
            {name}
          </button>
        ))}
      </div>
      <div className={styles.themeWindow} data-reveal>
        <ForkWindow mode={look === "system" ? undefined : look} label={`The Fork window in ${look === "system" ? "your Mac’s" : look} mode`} />
      </div>
    </>
  );
}
