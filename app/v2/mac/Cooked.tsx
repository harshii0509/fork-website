import Image from "next/image";
import Link from "next/link";
import { ENTRIES, RELEASES, STICKER } from "../../whats-cooking/entries";
import type { Tint } from "../content";
import s from "./mac.module.css";
import Window from "./Window";

// Where heyclicky shows tweets, Fork shows what it shipped: the six latest app changes from What's cooking,
// each in a little tinted window. Nothing here is made up.
const TINTS: Tint[] = ["green", "blue", "rose", "teal", "sand", "blue"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const day = (at: string) => `${+at.slice(8, 10)} ${MONTHS[+at.slice(5, 7) - 1]}`;

export default function Cooked() {
  const latest = ENTRIES.filter((e) => e.where === "app").slice(0, 6);
  const days = Math.ceil((new Date(RELEASES[0].at).getTime() - new Date(RELEASES[RELEASES.length - 1].at).getTime()) / 86_400_000);
  const head = "shipped every few days";
  return (
    <section id="cooking" className={s.cooked} aria-labelledby="cooked-h">
      <p className={s.pill}>what&rsquo;s cooking</p>
      <div className={s.marquee} aria-hidden>
        <div className={s.marqueeTrack}>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>{head}</span>
          ))}
        </div>
      </div>
      <h2 id="cooked-h" className={s.cookedTitle}>
        {head}
        <span className={s.fresh} aria-hidden>
          fresh!
        </span>
      </h2>
      <div className={s.wall}>
        {latest.map((e, i) => (
          <div key={e.at + e.title} data-reveal style={{ ["--i" as string]: i % 3 }}>
            <Window tint={TINTS[i]} small>
              <article className={s.post}>
                <header>
                  <Image src="/art/fork-icon.png" width={32} height={32} alt="" />
                  <span>
                    <b>Fork {e.version ?? "next"}</b>
                    <small>{STICKER[e.kind].toLowerCase()}</small>
                  </span>
                </header>
                <h3>{e.title}</h3>
                <p>{e.what}</p>
                <time dateTime={e.at}>{day(e.at)}</time>
              </article>
            </Window>
          </div>
        ))}
      </div>
      <p className={s.tally} data-reveal>
        <Image src="/art/fork-icon.png" width={40} height={40} alt="" />
        <span>
          {RELEASES.length} releases in {days} days, every change written down.{" "}
          <Link href="/whats-cooking" data-track="cooking_clicked" data-from="home">
            see what&rsquo;s cooking
          </Link>
        </span>
      </p>
    </section>
  );
}
