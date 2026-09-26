"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import { track } from "./track";

// A hidden toy: poke the snowman and it hops; poke it five times and it snows. The first time it
// scrolls into view it waves, so people notice it's alive. Drawn upright in parts (arms, head,
// eyes, scarf tail) so each can move; the original Snowman.svg is the reference drawing.

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const FALL = "cubic-bezier(0.55, 0, 1, 0.45)"; // gravity, for the drop back down
const SWAY = "cubic-bezier(0.455, 0.03, 0.515, 0.955)";
const NS = "http://www.w3.org/2000/svg";

type Parts = { figure: SVGGElement; armL: SVGGElement; armR: SVGGElement; head: SVGGElement; eyes: SVGGElement; tail: SVGGElement };

// Right arm points right, left arm up-left: "up" is a negative turn for the right, positive for the left.
const wave = (sign: 1 | -1) =>
  [0, -25, 5, -25, 0].map((deg) => ({ transform: `rotate(${deg * sign}deg)` })) as Keyframe[];

export default function Snowman() {
  const figure = useRef<SVGGElement>(null);
  const armL = useRef<SVGGElement>(null);
  const armR = useRef<SVGGElement>(null);
  const head = useRef<SVGGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const tail = useRef<SVGGElement>(null);
  const field = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const playing = useRef<Animation[]>([]);
  const pokes = useRef({ count: 0, last: 0, side: 1, ever: false });

  const parts = (): Parts | null =>
    figure.current && armL.current && armR.current && head.current && eyes.current && tail.current
      ? { figure: figure.current, armL: armL.current, armR: armR.current, head: head.current, eyes: eyes.current, tail: tail.current }
      : null;
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = (list: Animation[]) => {
    playing.current.forEach((a) => a.cancel()); // a poke mid-hop starts a fresh one
    playing.current = list;
  };

  const blink = (eyes: SVGGElement, at: number, total: number) =>
    eyes.animate(
      [{ transform: "none" }, { offset: at, transform: "none" }, { offset: at + (60 / total), transform: "scaleY(0.1)" }, { offset: Math.min(1, at + (120 / total)), transform: "none" }, { transform: "none" }],
      { duration: total },
    );

  const hello = (p: Parts, both: boolean, ms: number) => {
    const list = [
      p.armR.animate(wave(1), { duration: ms, easing: SWAY }),
      p.head.animate([{ transform: "none" }, { transform: "rotate(4deg)" }, { transform: "none" }], { duration: ms, easing: SWAY }),
    ];
    if (both) list.push(p.armL.animate(wave(-1), { duration: ms, easing: SWAY }));
    return list;
  };

  const snow = () => {
    const box = field.current;
    if (!box) return;
    const w = box.clientWidth;
    for (let i = 0; i < 14; i++) {
      const size = 8 + Math.random() * 4;
      const flake = document.createElementNS(NS, "svg");
      flake.setAttribute("viewBox", "-6 -6 12 12");
      flake.setAttribute("width", `${size}`);
      flake.setAttribute("height", `${size}`);
      flake.setAttribute("class", styles.flake);
      flake.innerHTML = '<path d="M0 -5V5M-4.3 -2.5L4.3 2.5M-4.3 2.5L4.3 -2.5" />';
      const x = Math.random() * (w - size);
      flake.style.left = `${x}px`;
      box.append(flake);
      const drift = (Math.random() - 0.5) * 24;
      const frames: Keyframe[] = still()
        ? [{ opacity: 0, transform: `translateY(${40 + Math.random() * 120}px)` }, { opacity: 1, offset: 0.3 }, { opacity: 0 }]
        : [
            { opacity: 0, transform: "translate(0, -20px)" },
            { opacity: 1, offset: 0.15 },
            { opacity: 1, offset: 0.7 },
            { opacity: 0, transform: `translate(${drift}px, 200px)` },
          ];
      const fall = flake.animate(frames, {
        duration: still() ? 1200 : 1600 + Math.random() * 800,
        delay: Math.random() * 400,
        easing: SWAY,
        fill: "both",
      });
      fall.onfinish = () => flake.remove();
    }
  };

  const poke = () => {
    const p = parts();
    if (!p) return;
    const now = performance.now();
    const state = pokes.current;
    if (!state.ever) track("snowman_poked"); // once per visit: did they find it?
    state.ever = true;
    state.count = now - state.last > 1500 ? 1 : state.count + 1;
    state.last = now;
    const fifth = state.count === 5;
    if (fifth) state.count = 0;

    if (still()) {
      play([p.figure.animate([{ transform: "none" }, { transform: "scale(0.96)" }, { transform: "none" }], { duration: 120 }), blink(p.eyes, 0.3, 400)]);
    } else {
      const side = (state.side *= -1);
      const hop = [
        { transform: "none", easing: EASE_OUT },
        { offset: 0.18, transform: "scale(1.06, 0.9)", easing: EASE_OUT },
        { offset: 0.5, transform: `translateY(-18px) rotate(${6 * side}deg) scale(0.97, 1.04)`, easing: FALL },
        { offset: 0.78, transform: "scale(1.05, 0.93)", easing: EASE_OUT },
        { transform: "none" },
      ];
      const arm = (deg: number) => [
        { transform: "none", easing: EASE_OUT },
        { offset: 0.5, transform: `rotate(${deg}deg)`, easing: FALL },
        { offset: 0.8, transform: `rotate(${deg * -0.2}deg)`, easing: EASE_OUT },
        { transform: "none" },
      ];
      play([
        p.figure.animate(hop, { duration: 520 }),
        p.armL.animate(arm(20), { duration: 520 }),
        p.armR.animate(arm(-20), { duration: 520 }),
        p.tail.animate([{ transform: "none" }, { offset: 0.5, transform: "rotate(12deg)" }, { offset: 0.8, transform: "rotate(-4deg)" }, { transform: "none" }], { duration: 520, easing: SWAY }),
        blink(p.eyes, 0.78, 520),
        ...(fifth ? hello(p, true, 900) : []),
      ]);
    }
    if (fifth) {
      snow();
      track("snow_unlocked");
    }
  };

  // The first time it's properly on screen, it waves hello (unless someone already poked it).
  useEffect(() => {
    const el = button.current;
    if (!el || still()) return;
    let timer = 0;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        timer = window.setTimeout(() => {
          const p = parts();
          if (p && !pokes.current.ever) play(hello(p, false, 1100));
        }, 300);
      },
      { threshold: 0.6 },
    );
    seen.observe(el);
    return () => {
      seen.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <button ref={button} type="button" className={styles.snowmanButton} onClick={poke} aria-label="Poke the snowman">
      <svg className={styles.snowmanArt} width="119" height="139" viewBox="0 0 119 139" fill="none" aria-hidden focusable="false">
        <g className={`${styles.part} ${styles.lean}`} style={{ transformOrigin: "50.0px 135.6px" }}>
          <g ref={figure} className={styles.part} style={{ transformOrigin: "50.0px 135.6px" }}>
            <g ref={armL} className={styles.part} style={{ transformOrigin: "35.0px 61.6px" }}>
              <path d="M35.0 61.6C34.3 60.4 32.1 56.8 30.6 54.5C29.2 52.2 27.6 50.0 26.3 47.7C25.0 45.4 23.6 41.8 23.0 40.6" />
              <path d="M23.0 40.6C22.3 39.1 19.7 33.1 19.0 31.6" />
              <path d="M23.0 40.6C23.8 39.1 26.8 33.5 27.5 32.1" />
              <path d="M23.0 40.6C21.8 40.1 16.8 38.1 15.5 37.6" />
            </g>
            <g ref={armR} className={styles.part} style={{ transformOrigin: "68.5px 68.6px" }}>
              <path d="M68.5 68.6C69.9 68.2 73.9 67.1 77.0 66.4C80.0 65.7 83.6 65.0 86.6 64.3C89.6 63.7 93.6 62.9 95.0 62.6" />
              <path d="M95.0 62.6C96.1 61.6 100.4 57.6 101.5 56.6" />
              <path d="M95.0 62.6C96.4 62.7 102.1 63.4 103.5 63.6" />
              <path d="M95.0 62.6C95.8 63.7 98.8 68.4 99.5 69.6" />
            </g>
            <path className={styles.paperFill} d="M50.0 136.0C48.2 135.5 42.5 134.6 39.3 133.1C36.2 131.5 33.7 129.0 31.3 126.6C29.0 124.3 26.5 121.8 25.1 118.9C23.7 116.0 22.5 112.4 22.7 109.3C22.9 106.1 24.6 102.8 26.3 99.9C28.0 97.1 30.3 94.6 32.9 92.4C35.4 90.1 38.4 87.6 41.7 86.4C45.1 85.2 49.4 84.7 52.9 85.1C56.5 85.6 60.1 87.6 63.1 89.3C66.2 91.1 69.0 93.3 71.2 95.8C73.5 98.3 75.9 101.3 76.8 104.4C77.7 107.5 77.3 111.3 76.5 114.4C75.6 117.5 73.6 120.3 71.7 123.0C69.7 125.6 67.7 128.3 65.0 130.4C62.3 132.4 58.8 134.5 55.4 135.1C52.0 135.8 46.2 134.6 44.4 134.5" />
            <path className={styles.paperFill} d="M50.0 90.7C48.8 90.3 45.1 89.4 42.8 88.4C40.6 87.4 38.5 86.1 36.6 84.6C34.8 83.0 32.6 81.2 31.6 79.0C30.5 76.8 30.2 74.0 30.4 71.6C30.7 69.2 32.0 66.8 33.1 64.7C34.3 62.5 35.7 60.4 37.5 58.7C39.3 57.0 41.7 55.3 44.1 54.6C46.5 54.0 49.5 54.3 52.0 54.8C54.4 55.3 56.6 56.5 58.8 57.7C61.0 58.8 63.3 60.0 64.9 61.7C66.5 63.5 68.1 65.8 68.6 68.1C69.2 70.3 68.7 73.0 68.2 75.3C67.8 77.6 66.9 79.8 65.7 82.0C64.6 84.1 63.2 86.6 61.2 88.1C59.3 89.6 56.4 90.6 53.9 91.0C51.3 91.3 47.4 90.1 46.1 90.0" />
            <g className={styles.inkFill}>
              <ellipse cx="46.5" cy="63.1" rx="2.5" ry="2" />
              <ellipse cx="46.0" cy="71.6" rx="2.5" ry="2" />
              <ellipse cx="46.5" cy="80.1" rx="2.5" ry="2" />
              <ellipse cx="48.5" cy="97.6" rx="2.5" ry="2" />
              <ellipse cx="49.0" cy="108.6" rx="2.5" ry="2" />
            </g>
            <g ref={head} className={styles.part} style={{ transformOrigin: "50.0px 53.6px" }}>
              <path className={styles.paperFill} d="M50.0 53.6C49.1 53.4 46.4 53.0 44.8 52.3C43.1 51.7 41.3 50.9 39.9 49.8C38.6 48.6 37.3 46.9 36.7 45.3C36.2 43.6 36.3 41.6 36.6 39.9C36.9 38.2 37.5 36.5 38.3 35.0C39.0 33.4 39.9 31.8 41.2 30.6C42.5 29.5 44.3 28.6 46.0 28.2C47.7 27.7 49.6 28.0 51.3 28.2C53.1 28.4 54.8 28.8 56.5 29.5C58.1 30.2 59.9 31.1 61.1 32.4C62.2 33.7 63.0 35.6 63.4 37.3C63.7 39.0 63.5 40.9 63.2 42.6C62.9 44.3 62.5 46.1 61.6 47.6C60.8 49.2 59.4 50.8 57.9 51.7C56.4 52.6 54.4 52.9 52.6 53.1C50.8 53.3 48.2 52.8 47.3 52.7" />
              <path d="M36.0 41.6C36.2 39.9 35.8 34.5 36.9 31.8C38.0 29.0 40.4 26.7 42.6 25.2C44.8 23.7 47.7 23.0 50.2 23.0C52.7 23.0 55.4 23.7 57.5 25.1C59.6 26.6 61.8 29.0 62.8 31.7C63.9 34.4 63.8 39.9 64.0 41.6" />
              <path className={styles.paperFill} d="M36.2 46.7C35.8 46.6 34.6 46.3 34.0 45.7C33.5 45.0 32.8 44.0 32.6 43.0C32.4 42.0 32.6 40.6 32.9 39.7C33.2 38.7 33.8 37.9 34.4 37.4C35.1 36.8 35.9 36.5 36.6 36.5C37.3 36.6 38.2 37.0 38.7 37.7C39.3 38.4 39.6 39.7 39.7 40.7C39.8 41.7 39.7 43.0 39.3 43.9C39.0 44.9 38.4 46.0 37.8 46.4C37.1 46.9 35.8 46.8 35.4 46.9" />
              <path className={styles.paperFill} d="M63.8 46.6C63.4 46.5 62.2 46.2 61.7 45.6C61.1 45.0 60.5 44.0 60.3 43.0C60.1 42.0 60.2 40.6 60.5 39.7C60.8 38.8 61.4 37.9 62.0 37.3C62.6 36.8 63.5 36.3 64.2 36.4C64.9 36.4 65.8 36.9 66.4 37.6C66.9 38.3 67.3 39.6 67.4 40.7C67.5 41.8 67.3 43.0 67.0 44.0C66.7 44.9 66.1 46.0 65.4 46.5C64.7 46.9 63.4 46.7 63.0 46.8" />
              <g ref={eyes} className={`${styles.part} ${styles.inkFill}`} style={{ transformOrigin: "50.0px 37.1px" }}>
                <ellipse cx="45.2" cy="37.1" rx="2.2" ry="1.7" />
                <ellipse cx="54.8" cy="37.1" rx="2.2" ry="1.7" />
              </g>
              <path className={styles.paperFill} d="M48.5 41.6C48.1 42.0 47.0 43.3 46.2 44.3C45.3 45.3 43.0 47.2 43.2 47.5C43.5 47.8 46.2 46.5 47.7 46.0C49.2 45.5 52.3 45.1 52.4 44.4C52.5 43.6 49.2 42.0 48.5 41.6" />
            </g>
            <path className={styles.paperFill} d="M35.0 49.6C36.3 50.1 40.1 51.9 42.7 52.5C45.2 53.1 47.6 53.0 50.1 53.1C52.6 53.1 55.0 53.3 57.5 52.7C59.9 52.2 63.6 49.3 65.0 49.6C66.5 50.0 67.3 53.4 66.1 54.9C64.9 56.5 60.6 58.2 57.9 59.0C55.2 59.9 52.5 60.1 49.8 60.1C47.2 60.1 44.6 59.8 42.0 59.0C39.4 58.1 35.2 56.5 34.1 54.9C32.9 53.3 34.8 50.5 35.0 49.6" />
            <g ref={tail} className={styles.part} style={{ transformOrigin: "59.5px 58.6px" }}>
              <path className={styles.paperFill} d="M56.0 58.6C55.9 60.0 55.8 64.5 55.6 67.5C55.4 70.5 53.8 75.0 54.9 76.6C56.0 78.2 61.1 78.6 62.4 77.1C63.6 75.6 62.3 70.7 62.5 67.4C62.7 64.1 63.3 59.2 63.5 57.6" />
              <path d="M55.7 76.6C55.6 77.2 55.4 79.9 55.3 80.6" />
              <path d="M58.8 76.8C58.8 77.5 58.8 80.3 58.8 81.1" />
              <path d="M61.9 77.0C62.0 77.6 62.3 80.0 62.4 80.6" />
            </g>
          </g>
        </g>
      </svg>
      <span ref={field} className={styles.snowfield} aria-hidden />
    </button>
  );
}
