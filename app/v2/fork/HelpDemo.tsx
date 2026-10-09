"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useSeen } from "../hooks";
import s from "../story.module.css";
import f from "./fork.module.css";

// Fork with someone new to the terminal, played once when it comes on screen: a command fails, the note under
// the terminal explains it in plain words and types the fix, you press Enter, it works; then a delete that goes
// to the Trash. With reduced motion every line is simply there. "Play again" runs it from the top.

const STEPS = 8;
const AT = [0, 700, 1400, 2300, 3400, 4300, 5300, 6100]; // when each step shows, in ms from the start

export default function HelpDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "0px 0px -25% 0px");
  const still = useReducedMotion();
  const [step, setN] = useState(0);
  const n = still ? STEPS : step;
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!seen || still) return;
    const ts = AT.map((t, i) => setTimeout(() => setN(i + 1), t + 300));
    return () => ts.forEach(clearTimeout);
  }, [seen, still, run]);

  return (
    <div ref={ref}>
      <div className={`${f.fork} ${s.help}`} aria-label="A terminal in Fork: npm run dev fails, Fork explains why and types npm install, which works; then rm moves a file to the Trash." role="img">
        <div className={s.helpBar} aria-hidden>
          <span>portfolio</span>
          <span className={s.mute}>~/portfolio</span>
        </div>
        <div className={s.helpTerm} aria-hidden>
          {n >= 1 && (
            <div className={s.line}>
              <span className={s.ps}>~/portfolio $ </span>npm run dev
            </div>
          )}
          {n >= 2 && (
            <div className={`${s.line} ${s.bad}`}>
              Error: Cannot find module &apos;next&apos;
              {"\n"}
              <span className={s.mute}>npm ERR! code MODULE_NOT_FOUND</span>
            </div>
          )}
          {n >= 3 && (
            <div className={s.oops}>
              <div className={s.oopsHead}>
                <span className={s.oopsDot} />
                That didn’t work
                <b>What went wrong?</b>
              </div>
              {n >= 4 && (
                <div className={s.oopsBody}>
                  This project’s packages aren’t installed yet, so there’s nothing to run. Install them, then try again.
                  <div className={s.fix}>
                    Typed for you: <code>npm install</code> <kbd>Enter</kbd> to run it
                  </div>
                </div>
              )}
            </div>
          )}
          {n >= 5 && (
            <div className={s.line}>
              <span className={s.ps}>~/portfolio $ </span>npm install
            </div>
          )}
          {n >= 6 && (
            <div className={s.line}>
              <span className={s.good}>✓ </span>added 312 packages in 9s
            </div>
          )}
          {n >= 7 && (
            <div className={s.line}>
              {"\n"}
              <span className={s.ps}>~/portfolio $ </span>rm old-logo.svg
            </div>
          )}
          {n >= 8 && (
            <div className={s.line}>
              <span className={s.good}>✓ </span>old-logo.svg is in the Trash. <span className={s.mute}>Put it back from Finder.</span>
            </div>
          )}
          {n >= 1 && n < 7 && <span className={f.cursor} />}
        </div>
      </div>
      {n >= STEPS && !still && (
        <button className={s.replay} onClick={() => {
            setN(0);
            setRun((r) => r + 1);
          }} data-track="help_replayed" data-from="learn">
          Play again
        </button>
      )}
    </div>
  );
}
