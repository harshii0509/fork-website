"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PROBLEM } from "../content";
import { Tab } from "../fork/ForkWindow";
import f from "../fork/fork.module.css";
import type { SqState } from "../fork/Square";
import { useReducedMotion, useSeen } from "../hooks";
import s from "../story.module.css";

// The problem, shown: five plain terminal windows in a pile, one quietly asking a question. The first time the
// pile is on screen it waits a beat, then each window shrinks towards its own tab and Fork's tab strip rises in
// its place, every square saying what that window was hiding. The switch below plays it either way.

type Win = { name: string; s: SqState; said: string; color: string; x: number; y: number; r: number; px: number; py: number; body: ReactNode };

const WINS: Win[] = [
  {
    name: "portfolio", said: "Asking you something", s: "needs", color: "var(--ws-1)", x: 4, y: 30, r: -2.5, px: 4, py: 4,
    body: (
      <>
        <span className={s.mute}>● Editing src/Hero.tsx</span>
        {"\n\n"}
        <span className={s.ask}>Allow this edit? (y/n) </span>
        <span className={s.caret} />
      </>
    ),
  },
  {
    name: "api", said: "Failed", s: "failed", color: "var(--ws-3)", x: 20, y: 6, r: 1.5, px: 20, py: 18,
    body: (
      <>
        <span className={s.mute}>$ npm run dev</span>
        {"\n"}
        <span className={s.bad}>Error: Cannot find module</span>
        {"\n"}
        <span className={s.bad}>{"  'express'"}</span>
      </>
    ),
  },
  {
    name: "docs", said: "Done, not seen yet", s: "needs", color: "var(--ws-2)", x: 26, y: 42, r: -1, px: 8, py: 34,
    body: (
      <>
        <span className={s.good}>✓ </span>Updated 6 files
        {"\n"}
        <span className={s.mute}>  Done 12 minutes ago</span>
        {"\n\n"}
        <span className={s.mute}>~/docs $</span>
      </>
    ),
  },
  {
    name: "gallery", said: "Working", s: "working", color: "var(--ws-2)", x: 52, y: 12, r: 2.5, px: 22, py: 50,
    body: (
      <>
        <span className={s.mute}>&gt; Rebuild the gallery page</span>
        {"\n\n"}● Working… <span className={s.mute}>(3m 40s)</span>
      </>
    ),
  },
  {
    name: "notes", said: "Ready", s: "idle", color: "var(--text-4)", x: 63, y: 44, r: -2, px: 6, py: 64,
    body: (
      <>
        <span className={s.mute}>Last login: Thu Oct 9</span>
        {"\n"}
        <span className={s.mute}>~/notes $</span>
      </>
    ),
  },
];

// The tab strip's order, and where each window goes when it becomes its tab (in cqw of the stage: the strip
// spans 4% to 96% in five slots, centred down the stage, which is 39.8cqw tall; a window is 34 × 21cqw).
const ORDER = ["portfolio", "docs", "api", "gallery", "notes"];
const toSlot = (w: Win) => {
  const slot = ORDER.indexOf(w.name);
  return { dx: 4 + 18.4 * (slot + 0.5) - (w.x + 17), dy: 19.9 - (w.y * 0.398 + 10.5) };
};

export default function Scatter() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "0px 0px -25% 0px");
  const still = useReducedMotion();
  const [state, setState] = useState<"pile" | "tabs">("pile");
  const touched = useRef(false);

  // Once, the first time it's well on screen: let the mess register, then tidy it.
  useEffect(() => {
    if (!seen || touched.current) return;
    const t = setTimeout(() => !touched.current && setState("tabs"), still ? 0 : 1400);
    return () => clearTimeout(t);
  }, [seen, still]);

  const pick = (next: "pile" | "tabs") => {
    touched.current = true;
    setState(next);
  };

  return (
    <div ref={ref} className={s.scatter} data-state={state}>
      <div className={`${f.fork} ${s.stage}`} role="img" aria-label="Five terminal windows piled on top of each other, which become five Fork tabs, each with a square showing its status.">
        {WINS.map((w, i) => {
          const { dx, dy } = toSlot(w);
          return (
            <div
              key={w.name}
              className={s.win}
              aria-hidden
              style={{ "--x": w.x, "--y": w.y, "--r": w.r, "--px": w.px, "--py": w.py, "--dx": dx, "--dy": dy, "--i": i } as CSSProperties}
            >
              <div className={s.winBar}>
                <i />
                <i />
                <i />
                <span>{w.name} · zsh</span>
              </div>
              <div className={s.winBody}>{w.body}</div>
            </div>
          );
        })}
        <div className={s.strip} aria-hidden>
          {ORDER.map((name, i) => {
            const w = WINS.find((x) => x.name === name)!;
            return (
              <span key={name} style={{ "--i": i } as CSSProperties}>
                <Tab name={name} color={w.color} s={state === "tabs" ? w.s : "idle"} on={i === 0} />
                <span className={s.said}>{w.said}</span>
              </span>
            );
          })}
        </div>
      </div>
      <div className={s.scatterFoot}>
        <p className={s.scatterSay} aria-live="polite">
          {state === "pile" ? PROBLEM.before : PROBLEM.after}
        </p>
        <div className={s.switch} role="group" aria-label="Show" data-on={state === "tabs" ? 1 : 0}>
          <span className={s.switchPill} aria-hidden />
          <button aria-pressed={state === "pile"} onClick={() => pick("pile")} data-track="problem_switched" data-item="today" data-from="problem">
            Today
          </button>
          <button aria-pressed={state === "tabs"} onClick={() => pick("tabs")} data-track="problem_switched" data-item="fork" data-from="problem">
            In Fork
          </button>
        </div>
      </div>
    </div>
  );
}
