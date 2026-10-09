"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion, useSeen, useTyped } from "../hooks";
import { DesignTokens } from "./Demos";
import styles from "./fork.module.css";
import Icon from "./Icon";
import Square, { type SqState } from "./Square";

// The Fork window as it is now (1.2): workspaces as tabs along the top, the sidebar with the open workspace's
// info and files, a terminal, and the panel showing Changes. Built at the app's real 1280 × 800 from its own
// sizes and colours, then scaled to fit.
//
// With `play`, it acts out one agent turn the first time it's on screen, once, and the panel follows it:
//   0  you type "Make the hero calmer" to an agent; the panel's App view shows your site
//   1  the square ripples (working) and edits come in; the site reloads after each, calmer, then in the new brand
//   2  done: the square settles, the pill slides to Changes, and the slider wipes from before to after
//   3  the pill slides to Design, where the brand token the agent edited
//   4  eases from the old colour to the new one, and "updated just now" ticks. Then it rests.
// Without `play`, or with reduced motion, it shows the end: Design, with the new brand.

const PROMPT = "Make the hero calmer";
const EDITS = [
  ["Reading", "src/styles/hero.css", ""],
  ["Editing", "src/styles/hero.css", "+8 −6"],
  ["Editing", "src/tokens.css", "--brand"],
  ["Editing", "src/Hero.tsx", "+2 −1"],
] as const;
const BRAND_WAS = "#e5484d"; // the loud red the site started with
const BRAND = "#12a594"; // the calmer teal the agent chose
const END = 4;

type Mode = "light" | "dark";

export default function ForkWindow({ play = false, mode, className = "", label = "The Fork window" }: { play?: boolean; mode?: Mode; className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "0px 0px -15% 0px");
  const still = useReducedMotion();
  const [phase, setPhase] = useState(play ? 0 : END);
  const [edits, setEdits] = useState(play ? 0 : EDITS.length);

  // Starts once, the first time it's seen; it doesn't loop.
  const started = play && seen;

  const typed = useTyped(PROMPT, started && phase === 0, 55);
  const shown = !play || still ? END : phase;

  useEffect(() => {
    if (!started || still) return;
    const at = (ms: number, f: () => void) => setTimeout(f, ms);
    const t0 = 300 + PROMPT.length * 55;
    const timers = [
      at(t0, () => setPhase(1)),
      ...EDITS.map((_, i) => at(t0 + 700 + i * 900, () => setEdits(i + 1))),
      at(t0 + 700 + EDITS.length * 900 + 600, () => setPhase(2)),
      at(t0 + 700 + EDITS.length * 900 + 3400, () => setPhase(3)),
      at(t0 + 700 + EDITS.length * 900 + 4100, () => setPhase(4)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started, still]);

  const n = shown >= 2 ? EDITS.length : edits;
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
            <Sidebar n={n} />

            <div className={styles.term}>
              <div className={styles.chip}>
                <Icon name="terminal" />
                <span>{shown === 0 ? "Terminal 1" : PROMPT}</span>
                <Icon name="x" size={12} />
              </div>
              <Transcript shown={shown} prompt={prompt} n={n} />
            </div>

            <Panel shown={shown} n={n} animate={play && !still} />
          </div>
        </div>
      </div>

      {/* On a phone the whole window would be too small to read: the strip, the terminal and the Changes slider
          instead, at their real size. */}
      <div className={styles.phone} aria-hidden>
        <div className={styles.phoneStrip}>
          <Tab name="portfolio" color="var(--ws-1)" s={sq} on />
          <Tab name="design-system" color="var(--ws-2)" s="needs" />
        </div>
        <div className={styles.phoneCard}>
          <div className={styles.chip}>
            <Icon name="terminal" />
            <span>{shown === 0 ? "Terminal 1" : PROMPT}</span>
          </div>
          <Transcript shown={shown} prompt={prompt} n={n} short />
          <div className={styles.phoneChanges}>
            <p className={styles.cap}>{shown >= 2 ? "Before and after" : "Before"}</p>
            <Wipe at={shown >= 2 ? 46 : 100} after={<Site brand={BRAND} />} />
          </div>
        </div>
      </div>
    </div>
  );
}

// The terminal's output: an earlier turn (so the window is lived in), then this one.
function Transcript({ shown, prompt, n, short = false }: { shown: number; prompt: string; n: number; short?: boolean }) {
  return (
    <div className={styles.out}>
      {!short && (
        <>
          <div className={styles.dim}>~/portfolio on main</div>
          <div className={styles.box}>&gt; Add a dark mode toggle to the nav</div>
          <div>
            <span className={styles.dim}>● </span>Editing src/Nav.tsx <span className={styles.dim}>+14 −2</span>
          </div>
          <div>
            <span className={styles.dim}>● </span>Editing src/styles/theme.css <span className={styles.dim}>+22</span>
          </div>
          <div>
            <span className={styles.ok}>✓ </span>The toggle follows the Mac until you pick one.
          </div>
          <br />
        </>
      )}
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
      {shown >= 2 && (
        <div className={styles.in}>
          <span className={styles.ok}>✓ </span>Calmer hero: softer colours, one button, more room.
          {!short && (
            <>
              <br />
              <br />
              <span className={styles.dim}>&gt; </span>
              <span className={styles.cursor} />
            </>
          )}
        </div>
      )}
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

// What the turn has changed so far, after each edit lands (hero.css, then tokens.css, then Hero.tsx).
const DIFF: Record<number, [number, number]> = { 2: [8, 6], 3: [9, 6], 4: [11, 7] };

function Sidebar({ n }: { n: number }) {
  const changed = n > 1;
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
                <span className={styles.plus}>+{DIFF[n][0]}</span> <span className={styles.minus}>−{DIFF[n][1]}</span> · {n - 1}{" "}
                {n === 2 ? "file" : "files"} changed
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
          <File name="tokens.css" depth={1} g={n > 2 ? "M" : undefined} />
          <File name="Hero.tsx" depth={1} g={n > 3 ? "M" : undefined} />
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

// The panel, following the turn: App (your site, live), then Changes (before and after), then Design (the
// tokens). One pill slides behind the tab names; the views cross-fade in a body of fixed height.
const TABS = ["File", "App", "Changes", "Design", "Read"] as const;

function Panel({ shown, n, animate }: { shown: number; n: number; animate: boolean }) {
  const view = shown < 2 ? "App" : shown === 2 ? "Changes" : "Design";
  // The site as the agent leaves it after each edit: loud, then calm (hero.css), then in the new brand (tokens.css).
  const look = n < 2 ? 0 : n < 3 ? 1 : 2;

  // The pill: measured from the current tab's label, so it fits each word. No slide on the first paint.
  const seg = useRef<HTMLSpanElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number; ready: boolean } | null>(null);
  useLayoutEffect(() => {
    const el = seg.current?.querySelector<HTMLElement>(`[data-tab="${view}"]`);
    if (!el) return;
    setPill((p) => ({ x: el.offsetLeft, w: el.offsetWidth, ready: p !== null }));
  }, [view]);

  return (
    <div className={styles.pv} data-animate={animate || undefined}>
      <div className={styles.pvHead}>
        <span ref={seg} className={styles.seg}>
          {pill && (
            <i
              className={styles.segPill}
              data-ready={pill.ready || undefined}
              style={{ width: pill.w, transform: `translateX(${pill.x - 2}px)` }}
            />
          )}
          {TABS.map((t) => (
            <span key={t} data-tab={t} data-cur={t === view || undefined} data-new={(t === "Changes" && shown === 2) || undefined}>
              {t}
            </span>
          ))}
        </span>
        <span key={view} className={`${styles.pvName} ${styles.in}`}>
          {view === "Design" ? (
            <>
              14 tokens{shown >= 4 && <small className={styles.fresh}>updated just now</small>}
            </>
          ) : view === "Changes" ? (
            <>
              localhost:3000<small>just now</small>
            </>
          ) : (
            "localhost:3000"
          )}
        </span>
      </div>
      <div className={styles.pvBody}>
        <div className={`${styles.view} ${styles.appView}`} data-on={view === "App" || undefined}>
          <div className={styles.appFrame}>
            {animate && n > 0 && <span key={n} className={styles.reload} />}
            <Site loud={look === 0} brand={look === 2 ? BRAND : BRAND_WAS} full />
          </div>
        </div>

        <div className={styles.view} data-on={view === "Changes" || undefined}>
          <p className={styles.cap}>Before and after</p>
          <Wipe at={shown >= 2 ? 46 : 100} after={<Site brand={BRAND} />} />
          <div className={styles.changed}>
            <p className={styles.cap}>Changed 3 files</p>
            <File name="hero.css" />
            <File name="tokens.css" />
            <File name="Hero.tsx" />
          </div>
          <div className={styles.changed}>
            <p className={styles.cap}>Earlier turns</p>
            <div className={styles.turns}>
              {["12 min ago", "40 min ago", "1 h ago"].map((t, i) => (
                <span key={t}>
                  <span className={styles.thumb} data-i={i}>
                    <Site brand={BRAND_WAS} />
                  </span>
                  <small>{t}</small>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.view} ${styles.designView}`} data-on={view === "Design" || undefined}>
          <DesignTokens brand={shown >= 4 ? BRAND : BRAND_WAS} />
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

// A small made-up page: crowded and shouting before, calm after. Greys, plus the project's --brand on the calm
// button. It follows the window's light or dark.
export function Site({ loud = false, brand, full = false }: { loud?: boolean; brand?: string; full?: boolean }) {
  return (
    <div className={styles.site} style={brand ? ({ "--brand": brand } as CSSProperties) : undefined}>
      <div className={styles.siteNav}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={`${styles.siteHero} ${loud ? styles.loud : styles.calm}`}>
        <b key={String(loud)} className={styles.in}>
          {loud ? "BUILD THINGS!!!" : "Build things."}
        </b>
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
      {/* In the App view the page fills the panel, so it goes on a little further down. */}
      {full && (
        <>
          <div className={styles.siteText}>
            <i style={{ width: "38%" }} />
            <i style={{ width: "92%" }} />
            <i style={{ width: "84%" }} />
            <i style={{ width: "66%" }} />
          </div>
          <div className={`${styles.siteCards} ${styles.siteWide}`}>
            <i />
            <i />
          </div>
          <div className={styles.siteText}>
            <i style={{ width: "30%" }} />
            <i style={{ width: "88%" }} />
            <i style={{ width: "72%" }} />
          </div>
        </>
      )}
    </div>
  );
}
