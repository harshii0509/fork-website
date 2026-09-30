"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "./hooks";
import styles from "./v2.module.css";

// Small pieces of the Fork window for the feature demos: a dark window in the Designer theme,
// terminal lines and the app's own bars. The words are copied from designer-terminal.

export function MiniWindow({ children, className = "", title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <div className={`${styles.miniWin} ${className}`} aria-hidden>
      <div className={styles.miniBar}>
        <span className={styles.miniLights}>
          <i />
          <i />
          <i />
        </span>
        {title && <span className={styles.miniTitle}>{title}</span>}
      </div>
      <div className={styles.miniBody}>{children}</div>
    </div>
  );
}

export function Line({ children, tone = "text" }: { children?: ReactNode; tone?: "text" | "dim" | "accent" | "bad" | "ok" }) {
  return <div className={`${styles.miniLine} ${styles[`tone_${tone}`]}`}>{children ?? " "}</div>;
}

export function Prompt({ children, cursor = false }: { children?: ReactNode; cursor?: boolean }) {
  return (
    <div className={styles.miniLine}>
      <span className={styles.tone_dim}>❯ </span>
      <span className={styles.tone_text}>{children}</span>
      {cursor && <span className={styles.miniCursor} />}
    </div>
  );
}

// Types `text` out, a character at a time, while `run` is true; shows all of it with reduced motion.
export function useTyped(text: string, run: boolean, perChar = 45) {
  const still = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run || still) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) clearInterval(t);
    }, perChar);
    return () => {
      clearInterval(t);
      setN(0);
    };
  }, [run, still, text, perChar]);
  return still ? text : text.slice(0, n);
}

// Claude Code's prompt box.
export function ClaudeBox({ children }: { children: ReactNode }) {
  return <div className={styles.cBox}>{children}</div>;
}
