"use client";

import { useEffect, useState, type MouseEvent } from "react";
import styles from "./blueprint.module.css";

// The changelog's version rail: every release, the one on screen marked. Clicking one scrolls to its sheet.

export type RailItem = { id: string; label: string; note: string };

export default function Rail({ items }: { items: RailItem[] }) {
  const [on, setOn] = useState(items[0]?.id);

  useEffect(() => {
    // A sheet is "on screen" when it crosses a line a third of the way down the view.
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)),
      { rootMargin: "-33% 0px -66% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  // Keep the marked version in sight in the phone's sideways rail.
  useEffect(() => {
    const a = document.querySelector(`[data-rail="${on}"]`);
    const rail = a?.parentElement?.parentElement;
    if (!a || !rail || rail.scrollWidth <= rail.clientWidth) return;
    rail.scrollTo({ left: (a as HTMLElement).offsetLeft - 16 });
  }, [on]);

  const go = (e: MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav className={styles.rail} aria-label="Releases">
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} data-rail={it.id} aria-current={on === it.id ? "location" : undefined} onClick={(e) => go(e, it.id)}>
              {it.label}
              <small>{it.note}</small>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
