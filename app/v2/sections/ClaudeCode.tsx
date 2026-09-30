"use client";

import { useEffect, useRef, useState } from "react";
import Bloub from "../Bloub";
import { BLOB_LOOKS, CLAUDE_CHIPS, type ClaudeChip } from "../content";
import { useInView, useLoop, useReducedMotion } from "../hooks";
import { ClaudeBox, Line, MiniWindow, Prompt, useTyped } from "../Mini";
import ShaderPanel from "../ShaderPanel";
import styles from "../v2.module.css";

// "Built around Claude Code": chips on the left pick a demo on the right, like tabs. They move on
// by themselves every few seconds until someone picks one.

const CYCLE_MS = 6500;

export default function ClaudeCode() {
  const [chip, setChip] = useState<ClaudeChip>("working");
  const [picked, setPicked] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const on = useInView(box, "-15% 0px");
  const still = useReducedMotion();

  useEffect(() => {
    if (picked || !on || still) return;
    const t = setTimeout(() => {
      const i = CLAUDE_CHIPS.findIndex((c) => c.id === chip);
      setChip(CLAUDE_CHIPS[(i + 1) % CLAUDE_CHIPS.length].id);
    }, CYCLE_MS);
    return () => clearTimeout(t);
  }, [chip, picked, on, still]);

  const current = CLAUDE_CHIPS.find((c) => c.id === chip)!;
  return (
    <div ref={box} className={styles.claudeGrid}>
      <div className={styles.claudeCopy} data-reveal>
        <h2 className={styles.h2}>Built around Claude Code.</h2>
        <p className={styles.lede}>Fork keeps an eye on Claude for you, so you can look away.</p>
        <div className={styles.chips} role="tablist" aria-label="What Fork does with Claude Code">
          {CLAUDE_CHIPS.map((c) => (
            <button
              key={c.id}
              role="tab"
              id={`chip-${c.id}`}
              aria-selected={chip === c.id}
              aria-controls="claude-demo"
              className={styles.chip}
              data-track="chip_selected"
              data-item={c.id}
              data-from="claude"
              onClick={() => {
                setChip(c.id);
                setPicked(true);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className={styles.chipText} aria-live="polite">
          <b>{current.lead}</b> {current.body}
        </p>
      </div>

      <ShaderPanel
        shader="Metaballs"
        base="#E9E2D3"
        className={styles.claudeStage}
        steer={0.12}
        params={{
          colorBack: "#E9E2D3",
          colors: ["#7C6CFF", "#D5567D", "#F2D58E", "#B8AEFF"],
          count: chip === "working" ? 12 : 7,
          size: 0.8,
          speed: chip === "working" ? 1 : 0.4,
          scale: 1.2,
        }}
      >
        <div id="claude-demo" role="tabpanel" aria-labelledby={`chip-${chip}`} className={styles.claudeDemo} key={chip}>
          {chip === "working" && <WorkingDemo />}
          {chip === "blobs" && <BlobsDemo />}
          {chip === "drop" && <DropDemo />}
          {chip === "newline" && <NewlineDemo />}
          {chip === "restore" && <RestoreDemo />}
        </div>
      </ShaderPanel>
    </div>
  );
}

const WORK_STEPS = [3200, 2600] as const;

function WorkingDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(WORK_STEPS, useInView(ref));
  const working = step === 0;
  return (
    <div ref={ref} className={styles.demo}>
      <MiniWindow title="portfolio">
        <ClaudeBox>
          <Line>
            &gt; Make the hero section feel calmer
          </Line>
        </ClaudeBox>
        <Line />
        {working ? (
          <Line tone="accent">✻ Thinking…</Line>
        ) : (
          <>
            <Line>
              <span className={styles.tone_accent}>● </span>Softened the hero so it breathes a little more.
            </Line>
            <Line tone="dim">  └ Updated src/Hero.jsx</Line>
          </>
        )}
      </MiniWindow>
      <div className={styles.runBar} data-on={working || undefined}>
        <Bloub size={20} state="thinking" />
        <span>Claude is working.</span>
        <span className={styles.appBtn}>Stop it (Esc)</span>
        <span className={styles.appBtnGhost}>Play a game while you wait</span>
      </div>
    </div>
  );
}

function BlobsDemo() {
  const tabs = ["portfolio", "design-system", "api", "blog", "notes"];
  return (
    <div className={styles.demo}>
      <div className={styles.tabList} aria-hidden>
        <div className={styles.tabHead}>Terminals</div>
        {BLOB_LOOKS.map((l, i) => (
          <div key={l.key} className={styles.tabRow}>
            <Bloub size={22} state={l.state} expression={l.expression} color={l.bad ? "#e5484d" : "#7c6cff"} />
            <span className={styles.tabName}>{tabs[i]}</span>
            <span className={styles.tabTip}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DROP_STEPS = [1200, 1100, 2600] as const;

function DropDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const step = useLoop(DROP_STEPS, useInView(ref));
  return (
    <div ref={ref} className={styles.demo}>
      <MiniWindow title="portfolio">
        <ClaudeBox>
          <Line>
            &gt; Match the header to{" "}
            {step === 2 && <span className={styles.tone_accent}>My\ Designs/hero.png</span>}
            <span className={styles.miniCursor} />
          </Line>
        </ClaudeBox>
      </MiniWindow>
      <div className={styles.dragFile} data-step={step}>
        <span className={styles.fileIcon} />
        hero.png
      </div>
    </div>
  );
}

const NL_STEPS = [2600, 2400] as const;
const PROMPT_LINES = ["Make the pricing page feel calmer:", "- fewer borders", "- more space between plans"];

function NewlineDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref);
  const step = useLoop(NL_STEPS, on);
  const typed = useTyped(PROMPT_LINES.join("\n"), step === 0 && on, 38);
  const lines = (step === 0 ? typed : PROMPT_LINES.join("\n")).split("\n");
  return (
    <div ref={ref} className={styles.demo}>
      <MiniWindow title="portfolio">
        <ClaudeBox>
          {lines.map((l, i) => (
            <Line key={i}>
            
              {i === 0 ? "> " : "  "}
              {l}
              {i === lines.length - 1 && <span className={styles.miniCursor} />}
            </Line>
          ))}
        </ClaudeBox>
      </MiniWindow>
      <div className={styles.keys}>
        <kbd>⇧</kbd>
        <kbd>↵</kbd>
        <span>new line</span>
      </div>
    </div>
  );
}

function RestoreDemo() {
  return (
    <div className={styles.demo}>
      <MiniWindow title="portfolio">
        <Line tone="dim">● Softened the hero so it breathes a little more.</Line>
        <Line tone="dim">  └ Updated src/Hero.jsx</Line>
        <Line tone="dim">── Restored · 10:42 ──</Line>
        <Prompt>claude --continue</Prompt>
        <Line>
          <span className={styles.tone_accent}>● </span>Picking up where we left off: the hero.
        </Line>
        <Prompt cursor />
      </MiniWindow>
    </div>
  );
}
