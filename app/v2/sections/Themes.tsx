"use client";

import { useState } from "react";
import ForkApp from "../../ForkApp";
import { THEMES, themeVars } from "../content";
import styles from "../v2.module.css";

// Pick a theme and the Fork window below takes it, the way the whole app does.
export default function Themes() {
  const [name, setName] = useState<string>(THEMES[0].name);
  const theme = THEMES.find((t) => t.name === name)!;
  return (
    <>
      <div className={styles.swatches} role="radiogroup" aria-label="Try a theme" data-reveal>
        {THEMES.map((t) => (
          <button
            key={t.name}
            role="radio"
            aria-checked={t.name === name}
            className={styles.swatch}
            onClick={() => setName(t.name)}
            data-track="theme_tried"
            data-item={t.name}
            data-from="yours"
          >
            <span className={styles.swatchDot} style={{ background: t.bg, color: t.accent }} />
            {t.name}
          </button>
        ))}
      </div>
      <div className={styles.themeWindow} data-reveal>
        <ForkApp className={styles.themeApp} style={themeVars(theme)} />
      </div>
    </>
  );
}
