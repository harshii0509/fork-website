import Link from "next/link";
import { ENTRIES, RELEASES } from "../../whats-cooking/entries";
import { GITHUB, QUIET } from "../content";
import s from "../story.module.css";
import Dots, { type Release } from "./TimelineDots";

// 5.0 and 6.0, in Linear's way: two quiet cards (your agent as it ships; every release), then three numbers read
// from What's cooking and one quote in the maker's own words. Nothing here is made up.

const day = (at: string) => new Date(at).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

export default function Proof() {
  const releases: Release[] = [...RELEASES].reverse().map((r) => {
    const app = ENTRIES.filter((e) => e.version === r.version && e.where === "app");
    const lead = app.find((e) => e.kind === "new") ?? app[0];
    return { version: r.version, day: day(r.at), title: lead?.title ?? "Fixes and small things" };
  });
  const days = Math.ceil((new Date(RELEASES[0].at).getTime() - new Date(RELEASES[RELEASES.length - 1].at).getTime()) / 86_400_000);
  const changes = ENTRIES.filter((e) => e.where === "app").length;

  return (
    <section id="cooking" className={s.part} aria-label="Fork, as it ships">
      <div className={s.quiet}>
        <article className={s.card} data-reveal>
          <div className={s.cardArt} aria-hidden>
            <div className={s.keys}>
              {QUIET.agents.cmds.map((c) => (
                <span key={c} className={s.key}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <h3>{QUIET.agents.title}</h3>
          <p>{QUIET.agents.line}</p>
        </article>
        <article className={s.card} data-reveal>
          <div className={s.cardArt}>
            <Dots releases={releases} />
          </div>
          <h3>{QUIET.ships.title}</h3>
          <p>{QUIET.ships.line}</p>
          <Link className={s.more} href="/whats-cooking" data-track="cooking_clicked" data-from="proof">
            {QUIET.ships.more}
          </Link>
        </article>
      </div>

      <div className={s.numbers} data-reveal>
        <div className={s.num}>
          <b>{RELEASES.length}</b>
          <span>releases in {days} days</span>
        </div>
        <div className={s.num}>
          <b>{changes}</b>
          <span>changes to the app, each written down with why</span>
        </div>
        <div className={s.num}>
          <b>0</b>
          <span>
            accounts. Free, and the{" "}
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" data-track="github_clicked" data-from="numbers">
              code is on GitHub
            </a>
          </span>
        </div>
        <figure className={s.quote}>
          <blockquote>
            <p>“{QUIET.quote}”</p>
          </blockquote>
          <footer className={s.mono}>
            {QUIET.by[0]} · {QUIET.by[1]}
          </footer>
        </figure>
      </div>
    </section>
  );
}
