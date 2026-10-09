"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { track } from "../../track";
import Square from "../fork/Square";
import styles from "../v2.module.css";
import Go from "./Go";
import { type Facts, LINKS } from "./shared";

type Line = { kind: "ran"; text: string } | { kind: "help" } | { kind: "say"; text: string };
const PS1 = "~/fork $";
const MAX = 14;
const START: Line[] = [{ kind: "ran", text: "help" }, { kind: "help" }];

// Footer B: a Fork terminal that has already run `help`. Each command in the list is a link; type one at the
// prompt and press Return to run it (it clicks that link, so the site counts it the same way). Under it, the
// word Fork in big flat type, cut off by the page's edge.
export default function Prompt({ facts }: { facts: Facts }) {
  const [lines, setLines] = useState<Line[]>(START);
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);

  const add = (more: Line[]) => setLines((l) => [...l, ...more].slice(-MAX));
  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return add([{ kind: "ran", text: "" }]);
    if (cmd === "clear") return setLines([]);
    if (cmd === "help") return add([{ kind: "ran", text: cmd }, { kind: "help" }]);
    const link = LINKS.find((l) => l.cmd === cmd || l.name.replace(/\/$/, "") === cmd);
    if (!link) return add([{ kind: "ran", text: cmd }, { kind: "say", text: `fork: command not found: ${cmd} · try help` }]);
    add([{ kind: "ran", text: cmd }, { kind: "say", text: link.copy ? "copied the install command" : `opening ${link.what}…` }]);
    // The newest list holds the link: click it, as a person would. After `clear` there's no list, so do it here.
    const els = body.current?.querySelectorAll<HTMLElement>(`[data-cmd="${link.cmd}"]`);
    const el = els?.[els.length - 1];
    if (el) return el.click();
    track(link.track["data-track"], { from: "footer-typed" });
    if (link.copy) navigator.clipboard?.writeText(link.copy);
    else if (link.out) window.open(link.href, "_blank", "noopener");
    else window.location.href = link.href!;
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    run(text);
    setText("");
  };

  return (
    <footer className={styles.closing}>
      <div className={`${styles.footTop} ${styles.promptTop}`}>
        <div className={styles.pane}>
          <div className={styles.paneBar}>
            <Square color="var(--ink)" />
            <span>Fork {facts.version}</span>
            <span className={styles.statusMuted}>shipped {facts.shipped}</span>
            {facts.cooking > 0 && <span className={styles.statusMuted}>· {facts.cooking} cooking</span>}
          </div>
          <div className={styles.paneBody} ref={body} onClick={() => input.current?.focus({ preventScroll: true })}>
            {lines.map((l, i) =>
              l.kind === "ran" ? (
                <p key={i}>
                  <span className={styles.ps1}>{PS1}</span> {l.text}
                </p>
              ) : l.kind === "say" ? (
                <p key={i} className={styles.statusMuted}>
                  {l.text}
                </p>
              ) : (
                <dl key={i} className={styles.helpList}>
                  {LINKS.map((k) => (
                    <div key={k.cmd}>
                      <dt>
                        <Go link={k} className={styles.cmd}>
                          {k.cmd}
                        </Go>
                      </dt>
                      <dd>{k.what}</dd>
                    </div>
                  ))}
                </dl>
              ),
            )}
            <label className={styles.promptLine}>
              <span className={styles.ps1}>{PS1}</span>
              <input
                ref={input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Type a command, like help or download"
              />
              {!text && <span className={styles.caret} aria-hidden />}
            </label>
          </div>
        </div>
        <div className={styles.promptSide}>
          <p className={styles.statusMuted}>Free · for Macs with Apple Silicon</p>
          <p className={styles.signoff}>Built by Harshvardhan :)</p>
        </div>
      </div>
      <p className={styles.footType} aria-hidden>
        Fork
      </p>
    </footer>
  );
}
