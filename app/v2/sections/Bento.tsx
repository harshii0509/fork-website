"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { GITHUB, SMALL } from "../content";
import { Tab } from "../fork/ForkWindow";
import f from "../fork/fork.module.css";
import Figure from "../hairline/Figure";
import Snake from "../Snake";
import s from "../story.module.css";
import v from "../v2.module.css";

// The smaller things, in tiles of three sizes. The big one is a real game of Snake beside an agent at work (the
// agent finishes about half a minute in, and the game pauses to ask); Light and dark has a switch that changes
// only its own little Fork; the rest are a Hairline figure each.

type Look = "light" | "dark" | "mac";

export default function Bento() {
  const [done, setDone] = useState(false);
  const [look, setLook] = useState<Look>("mac");
  return (
    <div className={s.bento}>
      <article className={`${s.tile} ${s.tileBig}`} data-reveal>
        <h3 className={v.h3}>{SMALL.games[0]}</h3>
        <p>{SMALL.games[1]}</p>
        <div className={`${f.fork} ${s.games}`}>
          <div className={s.gamesStrip} aria-hidden>
            <Tab name="gallery" color="var(--ws-2)" s={done ? "needs" : "working"} />
            <Tab name="Snake" color="var(--ws-1)" s="idle" on />
          </div>
          <div className={s.gamesBody}>
            <div className={s.gamesTerm} aria-hidden>
              <div className={f.box}>&gt; Rebuild the gallery page</div>
              {done ? (
                <>
                  <div>
                    <span className={f.ok}>✓ </span>Rebuilt the gallery page.
                  </div>
                  <div className={f.dim}>{"  "}Updated 4 files</div>
                </>
              ) : (
                <div className={f.dim}>● Working…</div>
              )}
            </div>
            <Snake onDone={setDone} />
          </div>
        </div>
      </article>

      <article className={s.tile} data-reveal style={{ "--i": 1 } as CSSProperties}>
        <div className={s.tileFig}>
          <Figure name="riffle" label="A book whose pages riffle as you point at them." />
        </div>
        <h3 className={v.h3}>{SMALL.read[0]}</h3>
        <p>{SMALL.read[1]}</p>
      </article>

      <article className={s.tile} data-reveal style={{ "--i": 2 } as CSSProperties}>
        <h3 className={v.h3}>{SMALL.looks[0]}</h3>
        <p>{SMALL.looks[1]}</p>
        <div className={f.fork} data-mode={look === "mac" ? undefined : look}>
          <div className={s.looksDemo} aria-hidden>
            <div>
              <Tab name="portfolio" color="var(--ws-1)" s="idle" on />
              <Tab name="docs" color="var(--ws-2)" s="needs" />
            </div>
            <div className={s.looksLine}>
              <span className={f.dim}>~/portfolio $ </span>npm run dev
            </div>
          </div>
        </div>
        <div className={s.looks} role="group" aria-label="Look">
          {(
            [
              ["light", "Light"],
              ["dark", "Dark"],
              ["mac", "Your Mac"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} aria-pressed={look === k} onClick={() => setLook(k)} data-track="theme_tried" data-item={k} data-from="small">
              {label}
            </button>
          ))}
        </div>
      </article>

      <article className={s.tile} data-reveal>
        <div className={s.tileFig}>
          <Figure name="loupe" label="A magnifier sliding over a page of text." />
        </div>
        <h3 className={v.h3}>{SMALL.files[0]}</h3>
        <p>{SMALL.files[1]}</p>
      </article>

      <article className={s.tile} data-reveal style={{ "--i": 1 } as CSSProperties}>
        <div className={s.tileFig}>
          <Figure name="padlock" label="A padlock that opens as you point at it." />
        </div>
        <h3 className={v.h3}>{SMALL.signed[0]}</h3>
        <p>{SMALL.signed[1]}</p>
      </article>

      <article className={s.tile} data-reveal style={{ "--i": 2 } as CSSProperties}>
        <Image className={s.icon} src="/art/fork-icon.png" width={40} height={40} alt="" />
        <h3 className={v.h3}>{SMALL.free[0]}</h3>
        <p>
          {SMALL.free[1]}{" "}
          <a className={s.proofMore} style={{ marginTop: 0, fontSize: "inherit" }} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="small">
            See the code
          </a>
        </p>
      </article>
    </div>
  );
}
