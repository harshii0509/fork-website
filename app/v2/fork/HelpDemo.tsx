import s from "../story.module.css";
import f from "./fork.module.css";

// Fork with someone new to the terminal, as a picture of one moment: `n` is how far the story has got (1–8).
// A command fails, the note under it explains in plain words and types the fix, you press Enter and it works;
// then a delete goes to the Trash. The section around it (BreaksPart) plays it and lets the list jump.

export const HELP_STEPS = 8;

export default function HelpDemo({ n }: { n: number }) {
  return (
    <div className={`${f.fork} ${s.help}`} aria-label="A terminal in Fork: npm run dev fails, Fork explains why and types npm install, which works; then rm moves a file to the Trash." role="img">
      <div className={s.helpBar} aria-hidden>
        <span>portfolio</span>
        <span className={s.mute}>~/portfolio</span>
      </div>
      <div className={s.helpTerm} aria-hidden>
        {n >= 1 && (
          <div className={s.ln}>
            <span className={s.ps}>~/portfolio $ </span>npm run dev
          </div>
        )}
        {n >= 2 && (
          <div className={`${s.ln} ${s.bad}`}>
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
          <div className={s.ln}>
            <span className={s.ps}>~/portfolio $ </span>npm install
          </div>
        )}
        {n >= 6 && (
          <div className={s.ln}>
            <span className={s.good}>✓ </span>added 312 packages in 9s
          </div>
        )}
        {n >= 7 && (
          <div className={s.ln}>
            {"\n"}
            <span className={s.ps}>~/portfolio $ </span>rm old-logo.svg
          </div>
        )}
        {n >= 8 && (
          <div className={s.ln}>
            <span className={s.good}>✓ </span>old-logo.svg is in the Trash. <span className={s.mute}>Put it back from Finder.</span>
          </div>
        )}
        {n >= 1 && n < 7 && <span className={f.cursor} />}
      </div>
    </div>
  );
}
