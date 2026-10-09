"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useReducedMotion, useSeen } from "../hooks";
import s from "../story.module.css";
import { DesignTokens } from "./Demos";
import f from "./fork.module.css";
import { Site } from "./ForkWindow";

// The panel beside the terminal, to play with: App shows the project's page, Changes puts the page from before
// the agent's turn over the one after (drag the line, or use the arrow keys), and Design shows the tokens the
// agent changed. It opens on Changes; the first time it's on screen the line glides in from the right once.

const VIEWS = ["App", "Changes", "Design"] as const;
type View = (typeof VIEWS)[number];
const BRAND = "#12a594";
const CAPTION: Record<View, string> = {
  App: "localhost:3000",
  Changes: "Make the hero calmer · just now",
  Design: "14 tokens · updated just now",
};

export default function SeeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, "0px 0px -20% 0px");
  const still = useReducedMotion();
  const [view, setView] = useState<View>("Changes");
  // Where the line is: off to the right until it's first seen, then the middle, then wherever you put it.
  const [put, setAt] = useState<number | null>(null);
  const at = put ?? (seen ? 48 : 92);
  const [glide, setGlide] = useState(true);
  const [dragging, setDragging] = useState(false);

  // The pill under the current tab: measured from the tab, so it fits each name.
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const b = tabs.current[VIEWS.indexOf(view)];
    if (b) setPill({ x: b.offsetLeft, w: b.offsetWidth });
  }, [view]);


  const box = useRef<HTMLDivElement>(null);
  const moveTo = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setAt(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const down = (e: PointerEvent<HTMLDivElement>) => {
    setGlide(false);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => dragging && moveTo(e.clientX);
  const up = () => setDragging(false);
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    const to: ((a: number) => number) | null =
      e.key === "ArrowLeft" ? (a) => a - step : e.key === "ArrowRight" ? (a) => a + step : e.key === "Home" ? () => 0 : e.key === "End" ? () => 100 : null;
    if (!to) return;
    e.preventDefault();
    setGlide(false);
    setAt((p) => Math.min(100, Math.max(0, to(p ?? at))));
  };

  const tabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = VIEWS[(VIEWS.indexOf(view) + d + VIEWS.length) % VIEWS.length];
    setView(next);
    tabs.current[VIEWS.indexOf(next)]?.focus();
  };

  return (
    <div ref={ref} className={`${f.fork} ${s.see}`}>
      <div className={s.seeHead}>
        <div className={s.seeTabs} role="tablist" aria-label="The panel" onKeyDown={tabKey}>
          {pill && <span className={s.seePill} aria-hidden style={{ width: pill.w, transform: `translateX(${pill.x}px)` }} />}
          {VIEWS.map((v, i) => (
            <button
              key={v}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`see-${v}`}
              aria-selected={view === v}
              aria-controls={`see-${v}-view`}
              tabIndex={view === v ? 0 : -1}
              onClick={() => setView(v)}
              data-track="see_tab"
              data-item={v.toLowerCase()}
              data-from="see"
            >
              {v}
            </button>
          ))}
        </div>
        <span className={s.seeName}>{CAPTION[view]}</span>
      </div>

      <div className={s.seeBody}>
        <div id="see-App-view" role="tabpanel" aria-labelledby="see-App" className={s.seeView} data-on={view === "App" || undefined}>
          <div className={f.appFrame}>
            <Site brand={BRAND} full />
          </div>
        </div>

        <div id="see-Changes-view" role="tabpanel" aria-labelledby="see-Changes" className={s.seeView} data-on={view === "Changes" || undefined}>
          <div
            ref={box}
            className={s.drag}
            data-glide={(glide && !still) || undefined}
            data-dragging={dragging || undefined}
            role="slider"
            tabIndex={view === "Changes" ? 0 : -1}
            aria-label="Before and after: drag to compare"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(at)}
            aria-valuetext={`${Math.round(100 - at)}% after`}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onKeyDown={key}
          >
            <Site loud full />
            <div className={s.dragAfter} style={{ clipPath: `inset(0 0 0 ${at}%)` }}>
              <Site brand={BRAND} full />
            </div>
            <div className={s.dragLine} style={{ transform: `translateX(${at}%)` }}>
              <span className={s.grip} aria-hidden>
                ‹›
              </span>
            </div>
            <span className={s.dragTag} style={{ left: 10 }}>
              Before
            </span>
            <span className={s.dragTag} style={{ right: 10, opacity: at > 92 ? 0 : 1, transition: "opacity 150ms ease" } as CSSProperties}>
              After
            </span>
          </div>
        </div>

        <div id="see-Design-view" role="tabpanel" aria-labelledby="see-Design" className={`${s.seeView} ${s.seeDesign}`} data-on={view === "Design" || undefined}>
          <DesignTokens brand={BRAND} />
        </div>
      </div>
    </div>
  );
}
