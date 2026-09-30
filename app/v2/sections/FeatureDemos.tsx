"use client";

import { useRef } from "react";
import { useInView, useLoop } from "../hooks";
import { Line, MiniWindow, Prompt, useTyped } from "../Mini";
import styles from "../v2.module.css";

// The four feature cards' demos. Each is a short scripted loop of the real app's screens, that
// runs only while its card is on screen. Reduced motion shows the last step.

function useDemo(durations: readonly number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, "-10% 0px");
  const step = useLoop(durations, on);
  return { ref, step, on };
}

const CMDK_STEPS = [900, 1500, 2600, 1800] as const;
const QUERY = "take me up one folder";

// ⌘K: type plain words, get the command, run it.
export function CmdKDemo() {
  const { ref, step } = useDemo(CMDK_STEPS);
  const typed = useTyped(QUERY, step === 1);
  const q = step === 0 ? "" : step === 1 ? typed : QUERY;
  return (
    <div ref={ref} className={styles.demo}>
      <MiniWindow title="portfolio">
        <Prompt cursor={step !== 3}>{step === 3 ? "cd .." : ""}</Prompt>
        {step === 3 && <Line tone="dim">~/Fork Demo</Line>}
      </MiniWindow>
      <div className={styles.palette} data-open={step < 3 || undefined}>
        <div className={styles.palIn}>
          {q ? <span>{q}</span> : <span className={styles.palHint}>What do you want to do? e.g. “go back a folder”</span>}
          {step < 2 && <span className={styles.miniCursorLight} />}
        </div>
        <div className={styles.palHit} data-shown={step >= 2 || undefined}>
          <div>
            <b>Go up a folder</b>
            <small>Moves to the folder that contains this one.</small>
            <code>cd ..</code>
          </div>
          <span className={styles.palRun}>Run ⏎</span>
        </div>
      </div>
    </div>
  );
}

const OOPS_STEPS = [1400, 2800, 2400] as const;

// "What went wrong?": the error, the plain-words answer, the fix typed in (never run).
export function OopsDemo() {
  const { ref, step } = useDemo(OOPS_STEPS);
  return (
    <div ref={ref} className={styles.demo}>
      <MiniWindow title="portfolio">
        <Prompt>npm run dev</Prompt>
        <Line tone="bad">Error: listen EADDRINUSE: address already in use :::3000</Line>
        <Line tone="dim">    at Server.setupListenHandle</Line>
        <Prompt cursor>{step === 2 ? "lsof -i :3000" : ""}</Prompt>
        {step === 2 && <Line tone="dim">↵ Enter to run</Line>}
      </MiniWindow>
      <div className={styles.oops} data-step={step}>
        {step === 0 ? (
          <>
            <span>That didn’t work.</span>
            <span className={styles.appBtn}>What went wrong?</span>
          </>
        ) : (
          <>
            <span className={styles.oopsText}>
              Another app is already using port 3000, often an earlier copy of this one still running in another tab.
            </span>
            <span className={styles.appBtn} data-pressed={step === 2 || undefined}>
              Type the fix
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const NUDGE_STEPS = [1200, 2200, 2400, 2600] as const;
const CHIPS = ["Install what it needs", "Start the app", "See what changed", "Ask Claude"];

// Suggestions for this folder, and the safety nets.
export function NudgeDemo() {
  const { ref, step } = useDemo(NUDGE_STEPS);
  return (
    <div ref={ref} className={styles.demo}>
      <div className={styles.chipsRow}>
        {CHIPS.map((c) => (
          <span key={c} className={styles.appChip} data-on={(step === 1 && c === "Start the app") || undefined}>
            {c}
          </span>
        ))}
      </div>
      <MiniWindow title="portfolio">
        {step <= 1 && (
          <>
            <Prompt cursor>{step === 1 ? "npm run dev" : ""}</Prompt>
            {step === 1 && <Line tone="dim">↵ Enter to run · Runs the app on your computer.</Line>}
          </>
        )}
        {step === 2 && (
          <>
            <Prompt>rm old-logo.png</Prompt>
            <Line tone="dim">Moved to Trash - open the Trash in Finder to get it back.</Line>
            <Prompt cursor />
          </>
        )}
        {step === 3 && (
          <>
            <Prompt cursor>git reset --hard</Prompt>
            <Line tone="accent">Heads up: this can’t be undone. Press y to run it, any other key to cancel.</Line>
          </>
        )}
      </MiniWindow>
    </div>
  );
}

const SEE_STEPS = [1400, 2000, 3200] as const;

// Your app beside the terminal.
export function SeeDemo() {
  const { ref, step } = useDemo(SEE_STEPS);
  return (
    <div ref={ref} className={styles.demo}>
      <MiniWindow title="portfolio" className={styles.seeWin}>
        <div className={styles.seeSplit} data-open={step === 2 || undefined}>
          <div className={styles.seeTerm}>
            <Prompt>npm run dev</Prompt>
            <Line tone="ok">  ➜  Local: http://localhost:3000/</Line>
            <Prompt cursor />
            {step === 1 && (
              <div className={styles.ready}>
                <i />
                <span>
                  Your app is running at <b>localhost:3000</b>
                </span>
                <span className={styles.appBtn}>Show it</span>
              </div>
            )}
          </div>
          <div className={styles.seePage}>
            <div className={styles.seeUrl}>localhost:3000</div>
            <div className={styles.seeSite}>
              <i className={styles.seeH} />
              <i className={styles.seeP} />
              <i className={styles.seeP} style={{ width: "58%" }} />
              <i className={styles.seeBtn} />
            </div>
          </div>
        </div>
      </MiniWindow>
    </div>
  );
}
