"use client";

import { useState } from "react";
import Figure from "../v2/hairline/Figure";
import type { Kind, Where } from "../whats-cooking/entries";
import styles from "./terminal.module.css";

// The Terminal changelog's output: flags that filter what prints, then each release as its number drawn in light
// lines and its changes as log lines. A line opens like --verbose: what changed, then why.

export type LogLine = { id: string; kind: Kind; where: Where; when: string; title: string; what: string; why: string };
export type LogChapter = { id: string; version: string | null; served: string | null; lines: LogLine[] };

const MARK: Record<Kind, string> = { new: "+", better: "~", fixed: "!", kitchen: "#" };
const KINDS = ["new", "better", "fixed"] as const;
const WHERES = ["app", "website", "kitchen"] as const;

export default function Changelog({ chapters }: { chapters: LogChapter[] }) {
  const [kinds, setKinds] = useState<Set<string>>(new Set(KINDS));
  const [wheres, setWheres] = useState<Set<string>>(new Set(WHERES));
  const [open, setOpen] = useState<Set<string>>(new Set());

  const flip = (set: Set<string>, key: string, put: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    put(next);
  };
  // A kitchen change has no kind of its own to filter by, so only where it happened decides.
  const shows = (l: LogLine) => (l.kind === "kitchen" || kinds.has(l.kind)) && wheres.has(l.where);
  const shown = chapters.map((c) => ({ ...c, lines: c.lines.filter(shows) })).filter((c) => c.lines.length);
  const flags = [...KINDS.filter((k) => kinds.has(k)), ...WHERES.filter((w) => wheres.has(w))];
  const all = flags.length === KINDS.length + WHERES.length;

  return (
    <>
      <div className={styles.filters}>
        <p className={styles.filterCmd} aria-hidden>
          <span className={styles.ps}>~/fork $ </span>fork changelog{all ? "" : flags.map((f) => ` --${f}`).join("")}
        </p>
        <div className={styles.flagRow} role="group" aria-label="Show changes that are">
          {KINDS.map((k) => (
            <button key={k} aria-pressed={kinds.has(k)} data-kind={k} onClick={() => flip(kinds, k, setKinds)}>
              <span>{MARK[k]}</span> --{k}
            </button>
          ))}
          <i aria-hidden />
          {WHERES.map((w) => (
            <button key={w} aria-pressed={wheres.has(w)} onClick={() => flip(wheres, w, setWheres)}>
              --{w}
            </button>
          ))}
        </div>
        <nav className={styles.versions} aria-label="Releases">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              {c.version ? `v${c.version}` : "next"}
            </a>
          ))}
        </nav>
      </div>

      {shown.length === 0 && <p className={styles.log_err}>fork: no changes match those flags. Turn one back on.</p>}

      {shown.map((c) => (
        <section key={c.id} id={c.id} className={styles.chapter} aria-labelledby={`${c.id}-h`} data-reveal>
          <h2 id={`${c.id}-h`} className={styles.chapterHead}>
            <span>{c.version ? `v${c.version}` : "on the stove"}</span>
            <span className={styles.rule} aria-hidden />
            <small>
              {c.served ? `served ${c.served}` : "not served yet"} · {c.lines.length} {c.lines.length === 1 ? "change" : "changes"}
            </small>
          </h2>
          <div className={styles.chapterBody}>
            {c.version ? (
              <Figure name="numerals" digits={c.version} className={styles.numerals} intensity={0.5} label={`Fork ${c.version}, drawn in light lines: point at a digit and it lifts.`} />
            ) : (
              <p className={styles.next} aria-hidden>
                # the next release
                <br /># its number is drawn when it ships
              </p>
            )}
            <ol className={`${styles.log} ${styles.fullLog}`}>
              {c.lines.map((l) => {
                const on = open.has(l.id);
                return (
                  <li key={l.id} data-kind={l.kind} data-open={on || undefined}>
                    <button aria-expanded={on} aria-controls={`${l.id}-v`} onClick={() => flip(open, l.id, setOpen)}>
                      <span className={styles.mark}>{MARK[l.kind]}</span>
                      <span className={styles.when}>{l.when}</span>
                      <span className={styles.what}>{l.title}</span>
                      <span className={styles.where}>{l.where}</span>
                    </button>
                    <div id={`${l.id}-v`} className={styles.verbose} hidden={!on}>
                      <p>{l.what}</p>
                      <p>
                        <span>why: </span>
                        {l.why}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      ))}
    </>
  );
}
