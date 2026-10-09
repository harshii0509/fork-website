import { DOWNLOAD, GITHUB, LANDING } from "../content";
import Clip from "./Clip";
import Drag from "./Drag";
import s from "./mac.module.css";
import Window from "./Window";

// The top: "Fork" in the middle, the two buttons, and five little windows around it, each playing a real
// recording of Fork with its file name underneath. You can pick them up by the title bar. Stickers in between.
export function Apple() {
  return (
    <svg width="14" height="17" viewBox="0 0 814 1000" aria-hidden>
      <path
        fill="currentColor"
        d="M788 341c-6 4-108 62-108 190 0 149 131 201 135 203-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-164-40c-77 0-104 41-167 41s-106-58-156-128C46 791 0 664 0 543c0-194 126-297 250-297 66 0 121 43 162 43 40 0 102-46 177-46 29 0 131 3 199 98ZM555 160c31-37 53-88 53-139 0-7-1-14-2-20-50 2-110 34-146 76-28 32-55 83-55 135 0 8 1 16 2 18 3 1 9 2 14 2 45 0 101-30 134-72Z"
      />
    </svg>
  );
}

export function GitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

export function Buttons({ from }: { from: string }) {
  return (
    <div className={s.ctas}>
      <a className={s.aquaBlue} href={DOWNLOAD} data-track="download_clicked" data-from={from}>
        <Apple />
        download for mac
      </a>
      <a className={s.aquaWhite} href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from={from}>
        <GitHub />
        view on github
      </a>
    </div>
  );
}

export default function Hero() {
  return (
    <header id="top" className={s.hero}>
      <div className={s.heroCopy}>
        <h1 className={s.wordmark}>{LANDING.title}</h1>
        <p className={s.heroLine}>{LANDING.line}</p>
        <Buttons from="top" />
        <p className={s.micro}>{LANDING.micro}</p>
      </div>

      <div className={s.minis}>
        {LANDING.minis.map((m, i) => (
          <Drag key={m.clip} className={s[`m${i + 1}`]}>
            <figure className={s.mini}>
              <Window tint={m.tint} small>
                <Clip name={m.clip} label={m.label} />
              </Window>
              <figcaption>{m.file}</figcaption>
            </figure>
          </Drag>
        ))}
      </div>

      {/* Stickers: decoration only. */}
      <div className={s.stickers} aria-hidden>
        <span className={`${s.kao} ${s.k1}`}>^ ω ^</span>
        <span className={`${s.kao} ${s.k2}`}>{"{ ^-^ }"}</span>
        <span className={`${s.kao} ${s.k3}`}>(¬_¬)</span>
        <span className={`${s.kao} ${s.k4}`}>¯\_(ツ)_/¯</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.sticker} ${s.icon}`} src="/art/fork-icon.png" width={64} height={64} alt="" />
        <span className={`${s.sticker} ${s.squares}`}>
          <i data-s="working" />
          <i data-s="needs" />
          <i data-s="failed" />
          <i data-s="ready" />
        </span>
        <span className={`${s.sticker} ${s.tag}`}>
          <b>HELLO</b>
          <small>my name is</small>
          <em>Fork</em>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={`${s.sticker} ${s.bowl}`} src="/art/NoodleBowl.svg" width={58} height={58} alt="" />
      </div>
    </header>
  );
}
