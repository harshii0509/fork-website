"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

// One IntersectionObserver per margin, shared by every element that asks with that margin.
const observers = new Map<string, { io: IntersectionObserver; subs: Map<Element, (on: boolean) => void> }>();

function observe(el: Element, margin: string, cb: (on: boolean) => void) {
  let o = observers.get(margin);
  if (!o) {
    const subs = new Map<Element, (on: boolean) => void>();
    const io = new IntersectionObserver((es) => es.forEach((e) => subs.get(e.target)?.(e.isIntersecting)), { rootMargin: margin });
    o = { io, subs };
    observers.set(margin, o);
  }
  o.subs.set(el, cb);
  o.io.observe(el);
  return () => {
    o.subs.delete(el);
    o.io.unobserve(el);
  };
}

// True while the element is on screen (grown by `margin`, so things can start just before).
export function useInView(ref: RefObject<Element | null>, margin = "0px") {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, margin, setOn);
  }, [ref, margin]);
  return on;
}

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (cb: () => void) => {
  const m = matchMedia(motionQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, () => matchMedia(motionQuery).matches, () => false);
}

const subscribeVisible = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
};

export function usePageVisible() {
  return useSyncExternalStore(subscribeVisible, () => !document.hidden, () => true);
}

// Steps through a scripted demo: step i shows for durations[i] ms, then the next, looping. It
// holds still while `active` is false (off screen, hidden tab). Reduced motion shows the last step.
export function useLoop(durations: readonly number[], active: boolean) {
  const still = useReducedMotion();
  const visible = usePageVisible();
  const [step, setStep] = useState(0);
  const run = active && visible && !still;
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => clearTimeout(t);
  }, [run, step, durations]);
  return still ? durations.length - 1 : step;
}
