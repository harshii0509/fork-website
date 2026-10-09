"use client";

import { useState } from "react";
import { Tab } from "../fork/ForkWindow";
import forkStyles from "../fork/fork.module.css";
import Snake from "../Snake";
import styles from "../v2.module.css";

// Fork's games open in a split beside the terminal. Here the terminal half shows an agent at work, and the game
// half is a real game of Snake. When the agent finishes, its workspace's square turns yellow, the way the app's does.
export default function WhileYouWait() {
  const [done, setDone] = useState(false);
  return (
    <div className={styles.waitGrid}>
      <div className={`${forkStyles.fork} ${styles.waitWin}`} data-reveal>
        <div className={styles.waitStrip} aria-hidden>
          <Tab name="gallery" color="var(--ws-2)" s={done ? "needs" : "working"} />
          <Tab name="Snake" color="var(--ws-1)" s="idle" on />
        </div>
        <div className={styles.waitBody}>
          <div className={styles.waitTerm} aria-hidden>
            <div className={forkStyles.box}>&gt; Rebuild the gallery page</div>
            {done ? (
              <>
                <div>
                  <span className={forkStyles.ok}>✓ </span>Rebuilt the gallery page.
                </div>
                <div className={forkStyles.dim}>  Updated 4 files</div>
              </>
            ) : (
              <div className={forkStyles.dim}>● Working…</div>
            )}
          </div>
          <Snake onDone={setDone} />
        </div>
      </div>

      <aside className={styles.stove} data-reveal>
        <span className={styles.sticker} data-kind="new">
          In the panel
        </span>
        <h3 className={styles.h3}>Or read a book beside it</h3>
        <p>
          Open a PDF or EPUB in the panel (⌘P). Fork keeps your place in every book, and says when the agent is done.
        </p>
      </aside>
    </div>
  );
}
