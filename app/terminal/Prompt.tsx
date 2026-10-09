"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { track } from "../track";
import { DOWNLOAD, GITHUB } from "../v2/content";
import styles from "./terminal.module.css";

// A prompt you can type into. It knows a handful of commands: most jump to a part of the page, `changelog` opens
// it, `download` starts the download. Anything else gets a friendly "not found". Nothing here runs on your Mac.

type Line = { kind: "in" | "out" | "err"; text: string };

const JUMPS: Record<string, [string, string]> = {
  why: ["insight", "Why Fork exists"],
  workspaces: ["workspaces", "Workspaces and their squares"],
  design: ["design", "The Design tab"],
  more: ["more", "Everything else"],
  appearance: ["yours", "Light, dark or your Mac’s"],
  help: ["", ""],
  faq: ["faq", "Questions"],
  install: ["download", "Download Fork"],
  whoami: ["thanks", "Who made this"],
};

const HELP = [
  "Commands:",
  "  why          why Fork exists",
  "  workspaces   one tab per project, and its square",
  "  design       your design system, live",
  "  more         everything else",
  "  appearance   light, dark, or your Mac’s",
  "  changelog    every change, release by release",
  "  faq          questions, before you download",
  "  download     get Fork for your Mac",
  "  github       the source",
  "  clear        clear this",
];

export default function Prompt() {
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: "Type help and press return. Or just scroll." }]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const back = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const jump = (id: string) => {
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  };

  const run = (raw: string) => {
    const cmd = raw.trim().replace(/^fork\s+(--)?/, "").toLowerCase();
    const out: Line[] = [{ kind: "in", text: raw }];
    if (!cmd) return setLines((l) => [...l, ...out]);
    track("prompt_used", { command: cmd.split(/\s+/)[0].slice(0, 20) });
    if (cmd === "clear") return setLines([]);
    if (cmd === "help" || cmd === "ls") out.push(...HELP.map((text) => ({ kind: "out" as const, text })));
    else if (cmd === "changelog") {
      out.push({ kind: "out", text: "Opening the changelog…" });
      router.push("/terminal/cooking");
    } else if (cmd === "download") {
      out.push({ kind: "out", text: "Downloading Fork.dmg. Open it and drag Fork to Applications." });
      window.location.href = DOWNLOAD;
    } else if (cmd === "github") out.push({ kind: "out", text: GITHUB });
    else if (cmd.startsWith("sudo")) out.push({ kind: "err", text: "Nice try. Nothing here needs sudo." });
    else if (JUMPS[cmd]) {
      out.push({ kind: "out", text: `→ ${JUMPS[cmd][1]}` });
      jump(JUMPS[cmd][0]);
    } else out.push({ kind: "err", text: `fork: command not found: ${cmd.split(/\s+/)[0]}. Try help.` });
    setLines((l) => [...l, ...out].slice(-40));
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
      if (value.trim()) history.current.push(value);
      back.current = 0;
      setValue("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const h = history.current;
      if (!h.length) return;
      e.preventDefault();
      back.current = Math.max(0, Math.min(h.length, back.current + (e.key === "ArrowUp" ? 1 : -1)));
      setValue(back.current ? h[h.length - back.current] : "");
    }
  };

  return (
    <div className={styles.prompt} onClick={() => input.current?.focus({ preventScroll: true })}>
      <div className={styles.promptLog} aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={styles[`log_${l.kind}`]}>
            {l.kind === "in" ? (
              <>
                <span className={styles.ps}>~/fork $ </span>
                {l.text}
              </>
            ) : (
              l.text
            )}
          </div>
        ))}
      </div>
      <label className={styles.promptRow}>
        <span className={styles.ps}>~/fork $ </span>
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Type a command, like help"
          placeholder="help"
        />
      </label>
    </div>
  );
}
