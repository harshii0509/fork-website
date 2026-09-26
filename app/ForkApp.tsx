"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

// A look-alike of the Fork window, in place of a screenshot: hover it and type in its terminal, but
// nothing runs and clicks do nothing. Built at the app's real size (1280 × 800, spacing and colours
// copied from designer-terminal/index.html) and scaled down to fit, so it matches the app exactly.

const plex = IBM_Plex_Mono({ weight: "700", subsets: ["latin"] }); // the app's "Fork" wordmark

// Lucide icons (ISC), copied from designer-terminal/icons.js.
const ICONS = {
  "panel-left": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  "panel-right": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>',
  "columns-2": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/>',
  "rows-2": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/>',
  "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  settings:
    '<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  folder:
    '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  "folder-open":
    '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
  "file-code":
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 12.5 8 15l2 2.5"/><path d="m14 12.5 2 2.5-2 2.5"/>',
  "file-text":
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  "file-braces":
    '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/>',
};

type IconName = keyof typeof ICONS;

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={`${styles.mIc} ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

// The tab's Bloub, standing still: a purple ball with two little eyes.
function Blob() {
  return (
    <svg className={styles.mBlob} width="22" height="22" viewBox="0 0 22 22" aria-hidden focusable="false">
      <circle cx="11" cy="11" r="11" fill="#7a6df7" />
      <path d="M12.6 6.2l.9 1.9M16.8 5.4l.8 1.8" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

const Kbd = ({ k }: { k: string }) => (
  <kbd className={styles.mKbd}>
    <span>⌘</span>
    <span>{k}</span>
  </kbd>
);

// The sidebar's "In this folder" tree, as in the screenshot: src open, the rest closed.
type Row = { name: string; icon: IconName; depth?: number; twisty?: "open" | "shut"; noise?: boolean };
const TREE: Row[] = [
  { name: "public", icon: "folder", twisty: "shut" },
  { name: "src", icon: "folder-open", twisty: "open" },
  { name: "About.jsx", icon: "file-code", depth: 1 },
  { name: "Hero.jsx", icon: "file-code", depth: 1 },
  { name: "Work.jsx", icon: "file-code", depth: 1 },
  { name: "styles", icon: "folder", twisty: "shut" },
  { name: "node_modules", icon: "folder", twisty: "shut", noise: true },
  { name: "CLAUDE.md", icon: "file-text" },
  { name: "index.html", icon: "file-code" },
  { name: "package.json", icon: "file-braces" },
  { name: "README.md", icon: "file-text" },
];

// Claude at work, the same transcript as the screenshot. [text, tone] runs, one array per line.
type Tone = "text" | "dim" | "accent";
const TRANSCRIPT: [string, Tone][][] = [
  [],
  [[" ❯ ", "dim"], ["Make the hero section feel calmer", "text"]],
  [],
  [[" ● ", "accent"], ["Softened the hero so it breathes a little more:", "text"]],
  [["   · ", "dim"], ["Lighter heading weight", "text"]],
  [["   · ", "dim"], ["More space above the button", "text"]],
  [["   · ", "dim"], ["A muted background instead of the gradient", "text"]],
  [],
  [["   └ Updated ", "dim"], ["src/Hero.jsx", "text"], [" and ", "dim"], ["styles/hero.css", "text"]],
  [],
];
const TONE = { text: styles.mText, dim: styles.mDim, accent: styles.mAccent };

export default function ForkApp({ className }: { className: string }) {
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [caret, setCaret] = useState(0);
  const [sent, setSent] = useState<string[]>([]); // lines entered so far; they just sit there
  const [focused, setFocused] = useState(false);

  // Keep the newest line in view, like a terminal, without ever growing the window.
  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [sent]);

  const sync = (el: HTMLInputElement) => {
    setTyped(el.value);
    setCaret(el.selectionStart ?? el.value.length);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    setSent((s) => [...s, typed].slice(-40));
    setTyped("");
    setCaret(0);
    e.currentTarget.value = "";
  };

  const under = typed[caret] ?? " "; // the block cursor sits on a character, like xterm's
  return (
    <div className={`${className} ${styles.mock}`} role="group" aria-label="A preview of the Fork app. Try typing in its terminal.">
      <div className={styles.mFrame}>
        <div className={styles.mWin}>
          <aside className={styles.mSide} aria-hidden>
            <div className={styles.mSideTop}>
              <span className={styles.mLights}>
                <span className={styles.mClose}>
                  <svg viewBox="0 0 14 14"><path d="M4.5 4.5l5 5M9.5 4.5l-5 5" /></svg>
                </span>
                <span className={styles.mMin}>
                  <svg viewBox="0 0 14 14"><path d="M3.8 7h6.4" /></svg>
                </span>
                <span className={styles.mMax}>
                  <svg viewBox="0 0 14 14"><path d="M3.8 7h6.4M7 3.8v6.4" /></svg>
                </span>
              </span>
              <span className={styles.mIbtn}><Icon name="panel-left" /></span>
              <span className={styles.mIbtn}><Icon name="arrow-left" /></span>
              <span className={`${styles.mIbtn} ${styles.mOff}`}><Icon name="arrow-right" /></span>
            </div>
            <div className={styles.mSideScroll}>
              <div className={`${styles.mBrand} ${plex.className}`}>Fork</div>
              <div className={styles.mSrow}><Icon name="search" /><span>Search</span><Kbd k="K" /></div>
              <div className={styles.mSrow}><Icon name="settings" /><span>Settings</span><Kbd k="," /></div>
              <div className={styles.mDiv} />
              <div className={styles.mChips}>
                {["Start the app", "Ask Claude", "Show in Finder", "Go up a folder"].map((c) => (
                  <span key={c} className={styles.mChip}>{c}</span>
                ))}
              </div>
              <div className={styles.mSec}>
                <h3>Terminals</h3>
                <span className={styles.mAdd}><Icon name="plus" /></span>
              </div>
              {["portfolio", "design-system"].map((t, i) => (
                <div key={t} className={`${styles.mTab} ${i === 0 ? styles.mOn : ""}`}>
                  <span className={styles.mTblob}><Blob /></span>
                  <span className={styles.mTname}>{t}</span>
                  <span className={styles.mTclose}><Icon name="x" /></span>
                </div>
              ))}
              <h3 className={styles.mFolder}>In this folder</h3>
              {TREE.map((r) => (
                <div
                  key={r.name}
                  className={`${styles.mEntry} ${r.noise ? styles.mNoise : ""}`}
                  style={{ "--depth": r.depth ?? 0 } as React.CSSProperties}
                >
                  {r.twisty ? (
                    <span className={`${styles.mTwisty} ${r.twisty === "open" ? styles.mOpen : ""}`}>
                      <Icon name="chevron-right" />
                    </span>
                  ) : (
                    <span className={styles.mTwisty} />
                  )}
                  <Icon name={r.icon} />
                  <span>{r.name}</span>
                </div>
              ))}
            </div>
          </aside>

          <header className={styles.mTop} aria-hidden>
            <span className={styles.mCrumb}>Home</span>
            <span className={styles.mSep}>›</span>
            <span className={styles.mCrumb}>Fork Demo</span>
            <span className={styles.mSep}>›</span>
            <span className={`${styles.mCrumb} ${styles.mHere}`}>portfolio</span>
            <span className={styles.mSpacer} />
            <span className={styles.mIbtn}><Icon name="columns-2" /></span>
            <span className={styles.mIbtn}><Icon name="rows-2" /></span>
            <span className={styles.mIbtn}><Icon name="panel-right" /></span>
          </header>

          {/* Clicking anywhere in the terminal types into it, like the app. */}
          <div
            className={styles.mTerm}
            onMouseDown={(e) => e.preventDefault()} // keeps the typing going when clicked again
            onClick={() => input.current?.focus({ preventScroll: true })}
          >
            <div className={styles.mScreen} ref={screen}>
              {TRANSCRIPT.map((line, i) => (
                <div key={i} className={styles.mLine} aria-hidden>
                  {line.map(([t, tone], j) => <span key={j} className={TONE[tone]}>{t}</span>)}
                </div>
              ))}
              {sent.map((t, i) => (
                <div key={`s${i}`} className={styles.mLine} aria-hidden>
                  <span className={styles.mDim}> ❯ </span><span className={styles.mText}>{t}</span>
                </div>
              ))}
              <div className={styles.mLine} aria-hidden>
                <span className={styles.mDim}> ❯ </span>
                <span className={styles.mText}>{typed.slice(0, caret)}</span>
                <span className={`${styles.mCursor} ${focused ? styles.mFocused : ""}`}>{under}</span>
                <span className={styles.mText}>{typed.slice(caret + 1)}</span>
              </div>
            </div>
            <input
              ref={input}
              className={styles.mInput}
              aria-label="Type in the preview terminal (nothing runs)"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={200}
              onChange={(e) => sync(e.currentTarget)}
              onSelect={(e) => sync(e.currentTarget)}
              onKeyDown={onKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
