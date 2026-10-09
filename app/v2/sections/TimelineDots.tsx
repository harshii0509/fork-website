"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { PROOF } from "../content";
import s from "../story.module.css";
import v from "../v2.module.css";

export type Release = { version: string; day: string; count: number; title: string; what: string };

// The release dots: point at one (or tab to it) and the line under them says what it shipped. Starts on the newest.
export default function Dots({ releases, lede, more, figure }: { releases: Release[]; lede: string; more: string; figure: ReactNode }) {
  const [on, setOn] = useState(releases.length - 1);
  const r = releases[on];
  return (
    <div className={s.proof} data-reveal>
      <div className={s.proofFig}>{figure}</div>
      <div>
        <h2 id="proof-h" className={v.h2}>
          {PROOF.title}
        </h2>
        <p className={v.lede} style={{ marginTop: 14 }}>
          {lede}
        </p>
        <div className={s.track} style={{ "--n": releases.length, marginTop: 32 } as CSSProperties} role="group" aria-label="Releases">
          {releases.map((x, i) => (
            <button
              key={x.version}
              className={s.dot}
              aria-pressed={on === i}
              aria-label={`Fork ${x.version}, ${x.day}`}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={() => setOn(i)}
            >
              {x.version.replace(/\.0$/, "")}
              <i />
              <small>{x.day}</small>
            </button>
          ))}
        </div>
        <div className={s.shipped} aria-live="polite">
          <span>
            Fork {r.version} · {r.day}
            {r.count > 1 ? ` · ${r.count} changes` : ""}
          </span>
          <b style={{ marginTop: 8 }}>{r.title}</b>
          {r.what && <p>{r.what.split(/(?<=\.)\s/)[0]}</p>}
        </div>
        <Link className={s.proofMore} href="/whats-cooking" data-track="cooking_clicked" data-from="proof">
          {more}
        </Link>
      </div>
    </div>
  );
}
