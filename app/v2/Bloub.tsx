"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "./hooks";

// Fork's real mascot: public/vendor/bloub/bloub.js is copied from designer-terminal/vendor/bloub
// (MIT), and drawn as pixel art the way the app does it (designer-terminal/blob.js). It shows the
// app's tab states; it never listens to audio. With `gaze` it looks toward the pointer.

type Frame = unknown;
type Controller = {
  sample(): Frame;
  paint: string;
  setState(s: string): void;
  setExpression(e: string | null): void;
  setColor(c: string): void;
  lookAt(o: { yaw: number; pitch: number; mix?: number }): void;
  resetGaze(): void;
};
type Lib = {
  BloubController: new (o: { color?: string; state?: string; expression?: string | null }) => Controller;
  createPixelView(el: Element, size: number): { render(f: Frame, c: string): void; destroy(): void };
};

let loading: Promise<Lib> | null = null;
function loadBloub(): Promise<Lib> {
  const w = window as unknown as { Bloub?: Lib };
  if (w.Bloub) return Promise.resolve(w.Bloub);
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "/vendor/bloub/bloub.js";
    s.onload = () => (w.Bloub ? resolve(w.Bloub) : reject(new Error("Bloub missing")));
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return loading;
}

export default function Bloub({
  size,
  state = "idle",
  expression = null,
  color = "#7c6cff",
  gaze = false,
  className,
  label,
}: {
  size: number;
  state?: string;
  expression?: string | null;
  color?: string;
  gaze?: boolean;
  className?: string;
  label?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const ctrl = useRef<Controller | null>(null);
  const draw = useRef<() => void>(() => {});
  const inView = useInView(host, "80px");
  const still = useReducedMotion();

  // Mount once: the pixel canvas goes inside the span.
  useEffect(() => {
    let view: { destroy(): void } | null = null;
    let cancelled = false;
    loadBloub()
      .then((B) => {
        if (cancelled || !host.current) return;
        const c = new B.BloubController({ color, state, expression });
        const v = B.createPixelView(host.current, size);
        ctrl.current = c;
        view = v;
        draw.current = () => v.render(c.sample(), c.paint);
        draw.current();
      })
      .catch(() => {}); // no mascot is fine; the space stays
    return () => {
      cancelled = true;
      view?.destroy();
      ctrl.current = null;
      draw.current = () => {};
    };
    // Changes to state/colour are applied below, without rebuilding the canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useEffect(() => {
    ctrl.current?.setState(state);
    ctrl.current?.setExpression(expression);
    draw.current();
  }, [state, expression]);

  useEffect(() => {
    ctrl.current?.setColor(color);
    draw.current();
  }, [color]);

  // Animate only while on screen. Reduced motion: repaint once after a change, then hold.
  useEffect(() => {
    if (!inView) return;
    if (still) {
      const t = setTimeout(() => draw.current(), 450);
      return () => clearTimeout(t);
    }
    let raf = 0;
    const tick = () => {
      draw.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, still, state, expression]);

  // Look toward the pointer, softly (fine pointers only).
  useEffect(() => {
    if (!gaze || still || !matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = host.current;
      if (!el || !ctrl.current) return;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      ctrl.current.lookAt({ yaw: dx * 110, pitch: -dy * 110, mix: 0.9 });
    };
    const onLeave = () => ctrl.current?.resetGaze();
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [gaze, still]);

  return (
    <span
      ref={host}
      className={className}
      style={{ display: "inline-block", width: size, height: size, verticalAlign: "middle" }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
