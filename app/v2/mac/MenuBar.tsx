"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DOWNLOAD } from "../content";
import s from "./mac.module.css";

// The nav, drawn as a Mac menu bar: Fork and two links on the left, Fork's mark in the middle, and on the
// right the little status icons, your own clock, and "get Fork".
const tick = (cb: () => void) => {
  const id = setInterval(cb, 15_000);
  return () => clearInterval(id);
};
const now = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

export default function MenuBar() {
  const time = useSyncExternalStore(tick, now, () => "");
  return (
    <nav className={s.menubar} aria-label="Fork">
      <div className={s.menuLeft}>
        <a href="#top" className={s.menuBrand}>
          Fork
        </a>
        <a href="#needs-you" data-track="nav_clicked" data-item="features">
          features
        </a>
        <Link href="/whats-cooking" data-track="cooking_clicked" data-from="nav">
          what&rsquo;s cooking
        </Link>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.menuMark} src="/art/Fork.svg" width={12} height={16} alt="" aria-hidden />
      <div className={s.menuRight}>
        <span className={s.menuIcons} aria-hidden>
          <svg width="15" height="11" viewBox="0 0 15 11">
            <path d="M7.5 10.5 9.6 8.4a3 3 0 0 0-4.2 0L7.5 10.5ZM3.6 6.6a5.5 5.5 0 0 1 7.8 0l1.4-1.4a7.5 7.5 0 0 0-10.6 0l1.4 1.4ZM.8 3.8a9.5 9.5 0 0 1 13.4 0L15 3A10.6 10.6 0 0 0 0 3l.8.8Z" fill="currentColor" />
          </svg>
          <svg width="22" height="11" viewBox="0 0 22 11">
            <rect x=".5" y=".5" width="18" height="10" rx="3" fill="none" stroke="currentColor" opacity=".5" />
            <rect x="2" y="2" width="12" height="7" rx="1.6" fill="currentColor" />
            <path d="M20 4v3c.7-.2 1.2-.8 1.2-1.5S20.7 4.2 20 4Z" fill="currentColor" opacity=".5" />
          </svg>
        </span>
        <span className={s.menuTime} suppressHydrationWarning>
          {time}
        </span>
        <a className={s.menuGet} href={DOWNLOAD} data-track="download_clicked" data-from="nav">
          <svg width="11" height="13" viewBox="0 0 814 1000" aria-hidden>
            <path
              fill="currentColor"
              d="M788 341c-6 4-108 62-108 190 0 149 131 201 135 203-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-164-40c-77 0-104 41-167 41s-106-58-156-128C46 791 0 664 0 543c0-194 126-297 250-297 66 0 121 43 162 43 40 0 102-46 177-46 29 0 131 3 199 98ZM555 160c31-37 53-88 53-139 0-7-1-14-2-20-50 2-110 34-146 76-28 32-55 83-55 135 0 8 1 16 2 18 3 1 9 2 14 2 45 0 101-30 134-72Z"
            />
          </svg>
          get Fork
        </a>
      </div>
    </nav>
  );
}
