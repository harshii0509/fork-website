import { ENTRIES, RELEASES } from "../../whats-cooking/entries";
import s from "../story.module.css";

// Three numbers under a hairline, read from What's cooking so they're always true.
export default function Numbers() {
  const days = Math.ceil((new Date(RELEASES[0].at).getTime() - new Date(RELEASES[RELEASES.length - 1].at).getTime()) / 86_400_000);
  const changes = ENTRIES.filter((e) => e.where === "app").length;
  const facts = [
    [RELEASES.length, `releases in ${days} days`],
    [changes, "app changes, each written down"],
    [0, "accounts. Free, code on GitHub"],
  ] as const;

  return (
    <section className={s.numbers} aria-label="Fork in numbers" data-reveal>
      {facts.map(([n, what]) => (
        <p key={what} className={s.num}>
          <b>{n}</b>
          <span>{what}</span>
        </p>
      ))}
    </section>
  );
}
