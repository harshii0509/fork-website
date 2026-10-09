"use client";

import { useState, type CSSProperties } from "react";
import s from "../story.module.css";

export type Release = { version: string; day: string; title: string };

// Every release as a dot on one hairline, oldest to newest. Point at one (or tab to it) and the line under it
// says what it shipped. Starts on the newest.
export default function Dots({ releases }: { releases: Release[] }) {
  const [on, setOn] = useState(releases.length - 1);
  const r = releases[on];
  return (
    <div style={{ width: "100%" }}>
      <div className={s.track} style={{ "--n": releases.length } as CSSProperties} role="group" aria-label="Releases">
        {releases.map((x, i) => (
          <button
            key={x.version}
            className={s.dot}
            aria-pressed={on === i}
            aria-label={`Fork ${x.version}, ${x.day}: ${x.title}`}
            onMouseEnter={() => setOn(i)}
            onFocus={() => setOn(i)}
            onClick={() => setOn(i)}
          >
            <span data-major={x.version.endsWith(".0") || undefined}>{x.version.replace(/\.0$/, "")}</span>
            <i />
          </button>
        ))}
      </div>
      <p className={s.shipped} aria-live="polite">
        <b>{r.version}</b> · {r.day} · {r.title}
      </p>
    </div>
  );
}
