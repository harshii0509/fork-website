"use client";

import { useRef, type CSSProperties } from "react";
import { useInView, useLoop } from "../hooks";
import styles from "./fork.module.css";
import Icon from "./Icon";
import Square, { type SqState } from "./Square";
import { Tab } from "./ForkWindow";

// The two feature demos: the workspace tabs living through an afternoon, and the panel's Design view following
// an agent's edits. Both loop while on screen and hold still off it (useLoop); reduced motion shows the last step.

const AFTERNOON: { s: [SqState, SqState, SqState]; say: string }[] = [
  { s: ["working", "idle", "idle"], say: "An agent is working in portfolio." },
  { s: ["needs", "working", "idle"], say: "portfolio is done. Its square stays yellow until you look." },
  { s: ["needs", "working", "failed"], say: "Something failed in api. Red, so you see it from here." },
  { s: ["idle", "needs", "idle"], say: "You looked. Now docs has a question for you." },
];
const AFTERNOON_MS = [3400, 3400, 3400, 3400];

export function WorkspacesDemo({ className = "", mode }: { className?: string; mode?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, "-10% 0px");
  const step = useLoop(AFTERNOON_MS, on);
  const now = AFTERNOON[step];
  return (
    <div ref={ref} className={`${styles.fork} ${className}`} data-mode={mode}>
      <div className={styles.demoStrip} aria-hidden>
        <Tab name="notes" color="var(--text-4)" s="idle" on />
        <Tab name="portfolio" color="var(--ws-1)" s={now.s[0]} />
        <Tab name="docs" color="var(--ws-2)" s={now.s[1]} />
        <Tab name="api" color="var(--ws-3)" s={now.s[2]} />
      </div>
      <p className={styles.say} aria-live="polite">
        <span key={step} className={styles.in}>
          {now.say}
        </span>
      </p>
      <ul className={styles.legend}>
        {(
          [
            ["working", "Working", "ripples while an agent works"],
            ["needs", "Needs you", "finished, or asking you something"],
            ["failed", "Failed", "something didn’t work"],
            ["idle", "Ready", "its own colour: nothing to see"],
          ] as const
        ).map(([s, name, what]) => (
          <li key={s}>
            <span className={styles.big}>
              <Square s={s} color="var(--ws-1)" />
            </span>
            <b>{name}</b>
            <span>{what}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// An agent changes the brand colour three times; the Design view follows each edit.
const BRANDS = [
  ["#4f46e5", "indigo"],
  ["#e5484d", "red"],
  ["#12a594", "teal"],
] as const;
const BRAND_MS = [3200, 3200, 3200];

export function DesignDemo({ className = "", mode }: { className?: string; mode?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, "-10% 0px");
  const step = useLoop(BRAND_MS, on);
  const [brand] = BRANDS[step];
  const [was] = BRANDS[(step + BRANDS.length - 1) % BRANDS.length];

  const colours: [string, string, string][] = [
    ["--brand", brand, `color-mix(in oklab, ${brand} 72%, white)`],
    ["--surface", "#ffffff", "#18181b"],
    ["--text", "#18181b", "#fafafa"],
    ["--muted", "#71717a", "#a1a1aa"],
  ];

  return (
    <div ref={ref} className={`${styles.fork} ${className}`} data-mode={mode} aria-hidden>
      <div className={styles.demoTerm}>
        <span className={styles.dim}>● </span>
        <span key={step} className={styles.in}>
          Editing src/tokens.css <span className={styles.dim}>--brand: {was} → </span>
          {brand}
        </span>
      </div>
      <div className={styles.demoPanel}>
        <div className={styles.pvHead}>
          <span className={styles.seg}>
            <span>File</span>
            <span>App</span>
            <span>Changes</span>
            <span data-on>Design</span>
          </span>
          <span className={styles.pvName}>
            14 tokens
            <small key={step} className={styles.fresh}>
              updated just now
            </small>
          </span>
        </div>
        <div className={styles.ds}>
          <section className={styles.dsGroup}>
            <p className={styles.cap}>
              Colours<small>4</small>
              <span className={styles.themes}>
                <span>Default</span>
                <span>Dark</span>
              </span>
            </p>
            <div className={styles.grid}>
              {colours.map(([name, light, dark]) => (
                <div key={name} className={styles.tok} data-hot={(name === "--brand") || undefined}>
                  <div className={styles.sw}>
                    <i style={{ background: light }} />
                    <i style={{ background: dark }} />
                  </div>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.val}>{light}</span>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.dsGroup}>
            <p className={styles.cap}>
              Type<small>3</small>
            </p>
            <div className={styles.list}>
              {(
                [
                  ["--text-2xl", "24px", 24],
                  ["--text-base", "16px", 16],
                  ["--text-sm", "14px", 14],
                ] as const
              ).map(([name, val, px]) => (
                <div key={name} className={styles.row}>
                  <span className={styles.sample} style={{ fontSize: px }}>
                    Aa
                  </span>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.val}>{val}</span>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.dsGroup}>
            <p className={styles.cap}>
              Spacing<small>3</small>
            </p>
            <div className={styles.list}>
              {(
                [
                  ["--space-2", 8],
                  ["--space-4", 16],
                  ["--space-8", 32],
                ] as const
              ).map(([name, px]) => (
                <div key={name} className={styles.row}>
                  <span className={styles.bar}>
                    <i style={{ width: px * 2, background: brand }} />
                  </span>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.val}>{px}px</span>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.dsGroup}>
            <p className={styles.cap}>
              Radius and motion<small>4</small>
            </p>
            <div className={styles.grid}>
              {(
                [
                  ["--radius-sm", 4],
                  ["--radius-md", 8],
                  ["--radius-lg", 16],
                ] as const
              ).map(([name, r]) => (
                <div key={name} className={styles.tok}>
                  <span className={styles.corner} style={{ borderRadius: `${r}px 0 0 0` }} />
                  <span className={styles.name}>{name}</span>
                  <span className={styles.val}>{r}px</span>
                </div>
              ))}
              <div className={styles.tok}>
                <span className={styles.track} data-go={step % 2 === 1 || undefined} style={{ "--e": "cubic-bezier(.23,1,.32,1)" } as CSSProperties}>
                  <b>
                    <i style={{ background: brand }} />
                  </b>
                </span>
                <span className={styles.name} style={{ marginTop: 40 }}>
                  --ease-out
                </span>
                <span className={styles.val}>.23, 1, .32, 1</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <span className={styles.hint}>
        <Icon name="file-code" size={14} /> Read from your project’s own CSS, Tailwind or tokens.json
      </span>
    </div>
  );
}
