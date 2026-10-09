"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { PARTS, type Part } from "../content";
import HelpDemo, { HELP_STEPS } from "../fork/HelpDemo";
import SeeDemo, { VIEWS } from "../fork/SeeDemo";
import StatesDemo from "../fork/StatesDemo";
import { useInView, usePageVisible, useReducedMotion, useSeen } from "../hooks";
import s from "../story.module.css";
import Scatter, { type Pile } from "./Scatter";

// The four sections below the hero, each in Linear's shape: a heading on the left, one line and a mono index on
// the right, then a figure whose mono list drives the product beside it. Picking from a list (hover, click or
// focus) takes over from any autoplay for good.

function Fig({ part, on, pick, children }: { part: Part; on: number; pick: (i: number) => void; children: ReactNode }) {
  return (
    <section id={part.id} className={s.part} aria-labelledby={`${part.id}-h`}>
      <header className={s.head} data-reveal>
        <h2 id={`${part.id}-h`} className={s.title}>
          {part.title}
        </h2>
        <div>
          <p className={s.line}>{part.line}</p>
          <p className={`${s.mono} ${s.index}`}>{part.index}</p>
        </div>
      </header>
      <div className={s.fig} data-reveal>
        <span className={`${s.mono} ${s.figLabel}`} aria-hidden>
          {part.fig}
        </span>
        <ul className={s.list} role="group" aria-label={part.title}>
          {part.items.map(([label, line], i) => (
            <li key={label}>
              <button
                className={`${s.mono} ${s.item}`}
                aria-pressed={on === i}
                onClick={() => pick(i)}
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                data-track="fig_item"
                data-item={`${part.id}-${i + 1}`}
                data-from={part.id}
              >
                {label}
                <span>{line}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className={s.product}>{children}</div>
      </div>
    </section>
  );
}

// Steps through `count` choices every `ms` while on screen, until someone picks one.
function useAuto(count: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, "-15% 0px");
  const visible = usePageVisible();
  const still = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!on || !visible || still || held) return;
    const t = setTimeout(() => setI((x) => (x + 1) % count), ms);
    return () => clearTimeout(t);
  }, [on, visible, still, held, i, count, ms]);
  const pick = (x: number) => {
    setHeld(true);
    setI(x);
  };
  return { ref, i, pick };
}

export function ProblemPart() {
  const [state, setState] = useState<Pile>("pile");
  const [touched, setTouched] = useState(false);
  const tidy = useCallback(() => setState("tabs"), []);
  return (
    <Fig
      part={PARTS.problem}
      on={state === "pile" ? 0 : 1}
      pick={(i) => {
        setTouched(true);
        setState(i === 0 ? "pile" : "tabs");
      }}
    >
      <div className={s.middle}>
        <Scatter state={state} onTidy={tidy} touched={touched} />
      </div>
    </Fig>
  );
}

export function WorkspacesPart() {
  const { ref, i, pick } = useAuto(4, 3000);
  // The list is Working, Needs you, Failed, Ready; the window's tabs are in that order too.
  return (
    <div ref={ref}>
      <Fig part={PARTS.workspaces} on={i} pick={pick}>
        <div className={s.bleed}>
          <StatesDemo on={i} />
        </div>
      </Fig>
    </div>
  );
}

export function ChangesPart() {
  const [i, setI] = useState(1);
  return (
    <Fig part={PARTS.changes} on={i} pick={setI}>
      <div className={s.inset}>
        <SeeDemo view={VIEWS[i]} onView={(v) => setI(VIEWS.indexOf(v))} />
      </div>
    </Fig>
  );
}

// The terminal's story, played once when it's on screen; the list follows it, and picking jumps to that part.
const AT = [0, 700, 1400, 2300, 3400, 4300, 5300, 6100];
const ITEM_OF = (n: number) => (n <= 4 ? 0 : n <= 6 ? 1 : 2);
const STEP_OF = [4, 6, 8];

export function BreaksPart() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "0px 0px -25% 0px");
  const still = useReducedMotion();
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const n = still ? HELP_STEPS : step;
  useEffect(() => {
    if (!seen || still || held) return;
    const ts = AT.map((t, k) => setTimeout(() => setStep(k + 1), t + 300));
    return () => ts.forEach(clearTimeout);
  }, [seen, still, held]);
  return (
    <div ref={ref}>
      <Fig
        part={PARTS.breaks}
        on={ITEM_OF(Math.max(n, 1))}
        pick={(i) => {
          setHeld(true);
          setStep(STEP_OF[i]);
        }}
      >
        <div className={s.inset}>
          <HelpDemo n={n} />
        </div>
      </Fig>
    </div>
  );
}
