"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useSeen, useTyped } from "../hooks";
import styles from "./fork.module.css";
import Icon from "./Icon";
import Square, { type SqState } from "./Square";

// The Fork window as it is now (1.2): workspaces as tabs along the top, the sidebar with the open workspace's
// info and files, a terminal, and the panel showing Changes. Built at the app's real 1280 × 800 from its own
// sizes and colours, then scaled to fit.
//
// With `play`, it acts out one agent turn the first time it's on screen, once:
//   0  you type "Make the hero calmer" to an agent
//   1  the workspace's square ripples (working) and the terminal takes the task's name; edits come in
//   2  done: the square settles, Changes gets a new pair, and the slider wipes from before to after
// Without `play`, or with reduced motion, it shows the end of that turn.

const PROMPT = "Make the hero calmer";
const EDITS = [
  ["Reading", "src/styles/hero.css", ""],
  ["Editing", "src/styles/hero.css", "+8 −6"],
  ["Editing", "src/Hero.tsx", "+2 −1"],
] as const;

type Mode = "light" | "dark";

export default function ForkWindow({ play = false, mode, className = "", label = "The Fork window" }: { play?: boolean; mode?: Mode; className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "0px 0px -15% 0px");
  const still = useReducedMotion();
  const [phase, setPhase] = useState(play ? 0 : 2);
  const [edits, setEdits] = useState(play ? 0 : EDITS.length);

  // Starts once, the first time it's seen; it doesn't loop.
  const started = play && seen;

  const typed = useTyped(PROMPT, started && phase === 0, 55);
  const shown = !play || still ? 2 : phase;

  useEffect(() => {
    if (!started || still) return;
    const at = (ms: number, f: () => void) => setTimeout(f, ms);
    const t0 = 700 + PROMPT.length * 55;
    const timers = [
      at(t0, () => setPhase(1)),
      ...EDITS.map((_, i) => at(t0 + 700 + i * 900, () => setEdits(i + 1))),
      at(t0 + 700 + EDITS.length * 900 + 600, () => setPhase(2)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started, still]);

  const n = shown === 2 ? EDITS.length : edits;
  const prompt = shown === 0 ? typed : PROMPT;
  const sq: SqState = shown === 1 ? "working" : "idle";

  return (
    <div ref={ref} className={`${styles.fork} ${className}`} data-mode={mode} role="img" aria-label={label}>
      <div className={styles.frame}>
        <div className={styles.win} aria-hidden>
          <div className={styles.strip}>
            <span className={styles.lights}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.tbtn}>
              <Icon name="sidebar-simple" />
            </span>
            <div className={styles.tabs}>
              <Tab name="portfolio" color="var(--ws-1)" s={sq} on />
              <Tab name="design-system" color="var(--ws-2)" s="needs" />
              <Tab name="fork-website" color="var(--ws-3)" s="working" />
              <span className={`${styles.tbtn} ${styles.tnew}`}>
                <Icon name="plus" />
              </span>
            </div>
            <span className={`${styles.tbtn} ${styles.turn}`}>
              <Icon name="square-split-horizontal" />
            </span>
            <span className={`${styles.tbtn} ${styles.turn}`}>
              <Icon name="square-split-vertical" />
            </span>
            <span className={`${styles.tbtn} ${styles.flipX}`} style={{ color: "var(--text-1)" }}>
              <Icon name="sidebar-simple" />
            </span>
          </div>

          <div className={`${styles.stage} ${styles.withPanel}`}>
            <Sidebar changed={n > 1} />

            <div className={styles.term}>
              <div className={styles.chip}>
                <Icon name="terminal" />
                <span>{shown === 0 ? "Terminal 1" : PROMPT}</span>
                <Icon name="x" size={12} />
              </div>
              <div className={styles.out}>
                <div className={styles.dim}>~/portfolio on main</div>
                <div className={styles.box}>
                  &gt; {prompt}
                  {shown === 0 && <span className={styles.cursor} />}
                </div>
                {EDITS.slice(0, n).map(([verb, file, diff]) => (
                  <div key={verb + file} className={styles.in}>
                    <span className={styles.dim}>● </span>
                    {verb} {file} {diff && <span className={styles.dim}>{diff}</span>}
                  </div>
                ))}
                {shown === 1 && <div className={`${styles.dim} ${styles.in}`}>  Working…</div>}
                {shown === 2 && (
                  <div className={styles.in}>
                    <br />
                    <span className={styles.ok}>✓ </span>Calmer hero: softer colours, one button, more room.
                    <br />
                    <br />
                    <span className={styles.dim}>&gt; </span>
                    <span className={styles.cursor} />
                  </div>
                )}
              </div>
            </div>

            <Changes after={shown === 2} fresh={play && shown === 2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Tab({ name, color, s, on = false }: { name: string; color: string; s: SqState; on?: boolean }) {
  return (
    <span className={styles.tab} data-on={on || undefined} style={{ "--tab-c": color } as CSSProperties}>
      <Square s={s} />
      <span className={styles.tname}>{name}</span>
    </span>
  );
}

function Sidebar({ changed }: { changed: boolean }) {
  return (
    <div className={styles.side}>
      <div className={styles.sideTop}>
        <span className={styles.brand}>portfolio</span>
      </div>
      <div className={styles.sideBody}>
        <div className={styles.search}>
          <Icon name="magnifying-glass" size={14} />
          <span>Search</span>
          <kbd>⌘K</kbd>
        </div>
        <h3 className={styles.h3}>Workspace</h3>
        <div className={styles.info}>
          <div className={styles.line}>
            <Icon name="git-branch" />
            <span>main</span>
          </div>
          {changed && (
            <div className={`${styles.line} ${styles.in}`}>
              <Icon name="plus-minus" />
              <span>
                <span className={styles.plus}>+10</span> <span className={styles.minus}>−7</span> · 2 files changed
              </span>
            </div>
          )}
          <div className={styles.line}>
            <Icon name="globe" />
            <span>localhost:3000</span>
          </div>
        </div>
        <h3 className={styles.h3}>Files</h3>
        <div className={styles.files}>
          <File name="src" folder open />
          <File name="styles" folder open depth={1} />
          <File name="hero.css" depth={2} g={changed ? "M" : undefined} />
          <File name="Hero.tsx" depth={1} g={changed ? "M" : undefined} />
          <File name="App.tsx" depth={1} />
          <File name="public" folder />
          <File name="package.json" />
          <File name="README.md" md />
        </div>
      </div>
    </div>
  );
}

function File({ name, folder, open, depth = 0, g, md }: { name: string; folder?: boolean; open?: boolean; depth?: number; g?: "M" | "A"; md?: boolean }) {
  return (
    <div className={styles.file} style={{ "--depth": depth } as CSSProperties}>
      {folder ? <Icon name={open ? "caret-down" : "caret-right"} size={12} /> : <span style={{ width: 12 }} />}
      <Icon name={folder ? "folder" : md ? "file-md" : "file-code"} />
      <b>{name}</b>
      {g && (
        <span className={`${styles.badge} ${styles.in}`} data-g={g}>
          {g}
        </span>
      )}
    </div>
  );
}

// The panel's Changes view: the page before the turn and after it, one over the other, and a slider between.
function Changes({ after, fresh }: { after: boolean; fresh: boolean }) {
  return (
    <div className={styles.pv}>
      <div className={styles.pvHead}>
        <span className={styles.seg}>
          <span>File</span>
          <span>App</span>
          <span data-on data-new={fresh || undefined}>
            Changes
          </span>
          <span>Design</span>
          <span>Read</span>
        </span>
        <span className={styles.pvName}>
          {after && (
            <>
              localhost:3000<small>just now</small>
            </>
          )}
        </span>
      </div>
      <div className={styles.pvBody}>
        <p className={styles.cap}>Before and after</p>
        <Wipe at={after ? 46 : 100} />
        <div className={styles.changed}>
          <p className={styles.cap}>{after ? "Changed 2 files" : "Waiting for the turn to end"}</p>
          {after && (
            <>
              <File name="hero.css" />
              <File name="Hero.tsx" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Before and after, wiped by a slider at `at` percent: the after layer is clipped and the handle slides, both
// on transform and clip-path, together.
export function Wipe({ at, before = <Site loud />, after = <Site /> }: { at: number; before?: React.ReactNode; after?: React.ReactNode }) {
  return (
    <div className={styles.slide} style={{ "--at": `${at}%` } as CSSProperties}>
      {before}
      <div className={styles.after} style={{ clipPath: `inset(0 0 0 ${at}%)`, transition: "clip-path 1200ms var(--ease-in-out-cubic)" }}>
        {after}
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${at}%)`, transition: "transform 1200ms var(--ease-in-out-cubic)", pointerEvents: "none" }}>
        <span className={styles.handle} style={{ left: 0 }} />
      </div>
      <span className={`${styles.tag} ${styles.tagL}`}>Before</span>
      {at < 100 && <span className={`${styles.tag} ${styles.tagR} ${styles.in}`}>After</span>}
    </div>
  );
}

// A small made-up page: loud before, calm after.
export function Site({ loud = false }: { loud?: boolean }) {
  return (
    <div className={styles.site}>
      <div className={styles.siteNav}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={`${styles.siteHero} ${loud ? styles.loud : styles.calm}`}>
        <b>{loud ? "BUILD THINGS!!" : "Build things."}</b>
        <i style={{ width: "80%" }} />
        <i style={{ width: "56%" }} />
        <span>{loud ? "Start now →" : "Get started"}</span>
        {loud && <span style={{ marginTop: 0 }}>Learn more</span>}
      </div>
      <div className={styles.siteCards}>
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
