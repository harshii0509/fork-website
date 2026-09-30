"use client";

import { useState } from "react";
import Bloub from "../Bloub";
import { ClaudeBox, Line } from "../Mini";
import Snake from "../Snake";
import styles from "../v2.module.css";

// Fork's games open in a split beside the terminal. Here the "terminal" half shows Claude at work,
// and the game half is a real game of Snake.
export default function WhileYouWait() {
  const [done, setDone] = useState(false);
  return (
    <div className={styles.waitGrid}>
      <div className={styles.waitWin} data-reveal>
        <div className={styles.waitTerm} aria-hidden>
          <ClaudeBox>
            <Line>
              &gt; Rebuild the gallery page
            </Line>
          </ClaudeBox>
          <Line />
          {done ? (
            <>
              <Line>
                <span className={styles.tone_accent}>● </span>Rebuilt the gallery page.
              </Line>
              <Line tone="dim">  └ Updated 4 files</Line>
            </>
          ) : (
            <Line tone="accent">✻ Working…</Line>
          )}
          <div className={styles.waitBar}>
            {done ? (
              <>
                <Bloub size={18} state="notify" />
                <span>Finished while you were away</span>
              </>
            ) : (
              <>
                <Bloub size={18} state="thinking" />
                <span>Claude is working.</span>
              </>
            )}
          </div>
        </div>
        <Snake onDone={setDone} />
      </div>

      <aside className={styles.stove} data-reveal>
        <span className={styles.sticker}>On the stove</span>
        <h3 className={styles.h3}>Read a book beside the terminal</h3>
        <p>
          Open a PDF or EPUB next to your terminal. Fork remembers your place in every book, and a gentle note says
          when Claude is done. Coming in the next release.
        </p>
      </aside>
    </div>
  );
}
