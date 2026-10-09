"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import s from "./mac.module.css";

// A little window you can pick up by its title bar and move around the hero. Only its transform changes,
// straight on the element, so dragging never re-renders anything. It goes back to its spot on reload.
export default function Drag({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const at = useRef({ x: 0, y: 0 });

  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.button !== 0 || !(e.target as Element).closest("[data-bar]")) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.dataset.dragging = "";
    const start = { x: e.clientX - at.current.x, y: e.clientY - at.current.y };
    const move = (m: PointerEvent) => {
      at.current = { x: m.clientX - start.x, y: m.clientY - start.y };
      el.style.setProperty("--dx", `${at.current.x}px`);
      el.style.setProperty("--dy", `${at.current.y}px`);
    };
    const up = () => {
      delete el.dataset.dragging;
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  };

  return (
    <div ref={ref} className={`${s.drag} ${className}`} style={style} onPointerDown={down}>
      {children}
    </div>
  );
}
