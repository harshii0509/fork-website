"use client";

import { useEffect, useRef } from "react";
import { STICKER, type Entry, type Where } from "./entries";
import v2 from "../v2/v2.module.css";
import styles from "./cooking.module.css";

// The list on What's cooking: one row per day (its date on the left, sticky on wide screens), a card
// per change, and a "served" line where each release went out. Cards land as they scroll into view
// (see cooking.module.css). The tally lives in page.tsx.

const PLACE: Record<Where, string> = { app: "Fork app", website: "Website", kitchen: "" };
const RELEASE_PAGE = "https://github.com/harshii0509/Fork/releases/tag/v";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// Dates and times are read straight from `at` (India time), not converted to the visitor's zone:
// "4:43 am" is when it happened for the person who made it.
function day(at: string) {
  const [y, m, d] = at.slice(0, 10).split("-").map(Number);
  return `${DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]}, ${d} ${MONTHS[m - 1]}`;
}
function time(at: string) {
  const hit = /T(\d\d):(\d\d)/.exec(at);
  if (!hit) return null;
  const h = Number(hit[1]);
  return `${h % 12 || 12}:${hit[2]} ${h < 12 ? "am" : "pm"}`;
}
// `backticks` in an entry are commands: shown as code.
const rich = (text: string) => text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
const stove = (e: Entry) => e.where === "app" && !e.version;

export default function Kitchen({ entries, releases }: { entries: Entry[]; releases: { version: string; at: string }[] }) {
  const list = useRef<HTMLOListElement>(null);

  // Days and cards land once each as they scroll into view. Everything is visible to begin with; only
  // with JS and motion allowed does anything start hidden (data-animate). Cards that arrive together
  // land one after another (--i).
  useEffect(() => {
    const root = list.current;
    if (!root || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.dataset.animate = "";
    const seen = new IntersectionObserver(
      (hits) => {
        let i = 0;
        for (const h of hits) {
          if (!h.isIntersecting) continue;
          const el = h.target as HTMLElement;
          if (el.classList.contains(styles.card) || el.classList.contains(styles.served)) el.style.setProperty("--i", String(i++));
          el.dataset.seen = "";
          seen.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    root.querySelectorAll(`.${styles.day}, .${styles.card}, .${styles.served}`).forEach((c) => seen.observe(c));
    return () => seen.disconnect();
  }, []);

  // A release line goes above the newest entry that shipped in it.
  const served = new Set<string>();
  const days: { day: string; items: (Entry | { release: string; at: string })[] }[] = [];
  for (const e of entries) {
    const label = day(e.at);
    if (days[days.length - 1]?.day !== label) days.push({ day: label, items: [] });
    const today = days[days.length - 1].items;
    const r = e.version && !served.has(e.version) ? releases.find((x) => x.version === e.version) : undefined;
    if (r) {
      served.add(r.version);
      today.push({ release: r.version, at: r.at });
    }
    today.push(e);
  }

  return (
    <ol className={styles.days} ref={list}>
      {days.map((d) => (
        <li key={d.day} className={styles.day}>
          <h2 className={styles.dayLabel}>{d.day}</h2>
          <ol className={styles.cards}>
            {d.items.map((item) =>
              "release" in item ? (
                <li key={`v${item.release}`} className={styles.served}>
                  <a href={`${RELEASE_PAGE}${item.release}`} target="_blank" rel="noopener noreferrer">
                    🍜 Fork {item.release} served{time(item.at) ? ` at ${time(item.at)}` : ""}
                  </a>
                </li>
              ) : (
                <li key={item.at + item.title} className={styles.card}>
                  <div className={styles.meta}>
                    <span className={`${v2.sticker} ${styles.sticker}`} data-kind={item.kind}>
                      {STICKER[item.kind]}
                    </span>
                    {PLACE[item.where] && <span className={styles.place}>{PLACE[item.where]}</span>}
                    {stove(item) && (
                      <span className={styles.stove} title="Built, not in a release yet">
                        <span className={styles.wisps} aria-hidden>
                          <i />
                          <i />
                          <i />
                        </span>
                        on the stove
                      </span>
                    )}
                    {item.version && <span className={styles.version}>in {item.version}</span>}
                    <time className={styles.time} dateTime={item.at}>
                      {time(item.at) ?? "that day"}
                    </time>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.what}>{rich(item.what)}</p>
                  <p className={styles.why}>
                    <span className={styles.whyLabel}>why?</span> {rich(item.why)}
                  </p>
                </li>
              ),
            )}
          </ol>
        </li>
      ))}
    </ol>
  );
}
