"use client";

import { useEffect, useRef } from "react";
import { useInView, usePageVisible, useReducedMotion } from "../hooks";
import s from "./mac.module.css";

// A real recording of Fork (public/clips). It plays only while it's on screen and the tab is open, loops,
// and has no sound. With reduced motion it stays on its poster.
// Each clip's size, so its box is right before the video loads.
const SIZE: Record<string, [number, number]> = {
  "mini-needs": [720, 456],
  "mini-changes": [720, 452],
  "mini-design": [720, 406],
  "mini-oops": [720, 456],
  "mini-ask": [720, 456],
  "row-needs": [1280, 812],
  "row-oops": [1280, 812],
  "row-ask": [1280, 812],
};

export default function Clip({ name, label, className = "" }: { name: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const on = useInView(ref, "120px");
  const visible = usePageVisible();
  const still = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (on && visible && !still) v.play().catch(() => {});
    else v.pause();
  }, [on, visible, still]);

  const [width, height] = SIZE[name] ?? [1280, 800];
  return (
    <video
      ref={ref}
      width={width}
      height={height}
      className={`${s.clip} ${className}`}
      src={`/clips/${name}.mp4`}
      poster={`/clips/${name}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
