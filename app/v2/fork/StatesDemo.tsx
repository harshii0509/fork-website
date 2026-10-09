import type { ReactNode } from "react";
import s from "../story.module.css";
import f from "./fork.module.css";
import { Tab } from "./ForkWindow";
import type { SqState } from "./Square";

// A Fork window, cropped: four workspaces in four states along the top. `on` picks one, and its terminal shows
// what that state looks like inside.

const WS: { name: string; color: string; s: SqState; term: ReactNode }[] = [
  {
    name: "gallery",
    color: "var(--ws-2)",
    s: "working",
    term: (
      <>
        <span className={s.mute}>&gt; Rebuild the gallery page</span>
        {"\n\n"}● Reading src/Gallery.tsx{"\n"}● Editing src/Gallery.tsx <span className={s.mute}>+24 −8</span>
        {"\n"}● Working… <span className={s.mute}>(1m 12s)</span>
      </>
    ),
  },
  {
    name: "portfolio",
    color: "var(--ws-1)",
    s: "needs",
    term: (
      <>
        <span className={s.mute}>&gt; Make the hero calmer</span>
        {"\n\n"}
        <span className={s.good}>✓ </span>Edited hero.css and tokens.css{"\n\n"}
        <span className={s.ask}>Allow this edit to src/Hero.tsx? (y/n) </span>
        <span className={s.caret} />
      </>
    ),
  },
  {
    name: "api",
    color: "var(--ws-3)",
    s: "failed",
    term: (
      <>
        <span className={s.mute}>~/api $ </span>npm run dev{"\n"}
        <span className={s.bad}>Error: Cannot find module &apos;express&apos;</span>
        {"\n"}
        <span className={s.mute}>npm ERR! code MODULE_NOT_FOUND</span>
      </>
    ),
  },
  {
    name: "notes",
    color: "var(--text-4)",
    s: "idle",
    term: (
      <>
        <span className={s.mute}>Last login: Thu Oct 9 on ttys002</span>
        {"\n"}
        <span className={s.mute}>~/notes $ </span>
        <span className={s.caret} />
      </>
    ),
  },
];

export default function StatesDemo({ on }: { on: number }) {
  return (
    <div className={`${f.fork} ${s.states}`} role="img" aria-label={`Fork with four workspaces: gallery is working, portfolio needs you, api failed, notes is ready. Showing ${WS[on].name}.`}>
      <div className={s.statesStrip} aria-hidden>
        <span className={s.lights}>
          <i />
          <i />
          <i />
        </span>
        {WS.map((w, i) => (
          <Tab key={w.name} name={w.name} color={w.color} s={w.s} on={i === on} />
        ))}
      </div>
      <div className={s.statesTerm} aria-hidden>
        <div key={on} className={s.swap}>
          {WS[on].term}
        </div>
      </div>
    </div>
  );
}
