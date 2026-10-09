"use client";

import { useEffect, useRef, useState } from "react";
import { AGENTS } from "../content";
import f from "../fork/fork.module.css";
import { useInView, usePageVisible, useReducedMotion } from "../hooks";
import s from "../story.module.css";
import v from "../v2.module.css";

// Bring your own agent: a prompt that types one command after another (claude, codex, gemini…), each the way
// you'd start that tool in any terminal, because Fork runs it exactly as it ships. Types only while on screen;
// with reduced motion it shows them all at once.

export default function Agents() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref);
  const visible = usePageVisible();
  const still = useReducedMotion();
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (!on || !visible || still) return;
    const cmd = AGENTS.cmds[i];
    let t: ReturnType<typeof setTimeout>;
    if (!out && n < cmd.length) t = setTimeout(() => setN(n + 1), 70);
    else if (!out) t = setTimeout(() => setOut(true), 1400);
    else if (n > 0) t = setTimeout(() => setN(n - 1), 28);
    else
      t = setTimeout(() => {
        setOut(false);
        setI((i + 1) % AGENTS.cmds.length);
      }, 240);
    return () => clearTimeout(t);
  }, [on, visible, still, i, n, out]);

  return (
    <div ref={ref} className={s.agents} data-reveal>
      <div>
        <h2 id="agents-h" className={v.h2}>
          {AGENTS.title}
        </h2>
        <p className={`${v.lede} ${s.gap}`}>{AGENTS.lede}</p>
      </div>
      <div className={f.fork}>
        <div className={s.prompt} aria-label={`${AGENTS.cmds.join(", ")}, ${AGENTS.rest}`} role="img">
          <span className={s.ps} aria-hidden>
            ~/portfolio $
          </span>
          <span aria-hidden>{still ? AGENTS.cmds.slice(0, 4).join(" · ") : AGENTS.cmds[i].slice(0, n)}</span>
          {!still && <span className={f.cursor} aria-hidden />}
        </div>
        <p className={s.promptRest}>{AGENTS.rest}.</p>
      </div>
    </div>
  );
}
