"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "../track";
import styles from "./v2.module.css";

// A small Snake, the same idea as Fork's (designer-terminal/games.js): Nokia-style pixels in the
// Designer theme's colours. Arrows or WASD, or swipe on a phone. About half a minute in, "Claude"
// finishes and the game pauses the way the app's does: back to it, or keep playing.

const W = 22, H = 14, CELL = 12, TICK = 110;
const DONE_AFTER = 30_000;
const BG = "#141416", SNAKE = "#7c6cff", FOOD = "#ffb454", GRID = "#1c1c20";

type P = { x: number; y: number };
type Mode = "start" | "play" | "over" | "done";

const DIRS: Record<string, P> = {
  ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 },
};

const readBest = () => {
  try {
    return Number(localStorage.getItem("fork-snake-best")) || 0;
  } catch {
    return 0;
  }
};

export default function Snake({ onDone }: { onDone?: (done: boolean) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("start");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [interrupted, setInterrupted] = useState(false); // "Claude" only finishes once
  const game = useRef({ snake: [] as P[], dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, food: { x: 15, y: 7 }, startedAt: 0 });
  const played = useRef(false);

  const draw = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const g = game.current;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W * CELL, H * CELL);
    ctx.fillStyle = GRID;
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) ctx.fillRect(x * CELL + 5, y * CELL + 5, 2, 2);
    ctx.fillStyle = FOOD;
    ctx.fillRect(g.food.x * CELL + 2, g.food.y * CELL + 2, CELL - 4, CELL - 4);
    ctx.fillStyle = SNAKE;
    g.snake.forEach((p) => ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2));
  }, []);

  const placeFood = () => {
    const g = game.current;
    let f: P;
    do f = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
    while (g.snake.some((p) => p.x === f.x && p.y === f.y));
    g.food = f;
  };

  const start = useCallback(() => {
    const g = game.current;
    g.snake = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
    g.dir = g.next = { x: 1, y: 0 };
    g.startedAt = performance.now();
    placeFood();
    setScore(0);
    setBest((b) => Math.max(b, readBest())); // read on start: nothing to show before a first game
    setMode("play");
    if (!played.current) {
      played.current = true;
      track("snake_played");
    }
    canvas.current?.focus({ preventScroll: true });
  }, []);

  // The game loop, only while playing.
  useEffect(() => {
    draw();
    if (mode !== "play") return;
    const t = setInterval(() => {
      const g = game.current;
      if (g.next.x !== -g.dir.x || g.next.y !== -g.dir.y) g.dir = g.next;
      const head = { x: (g.snake[0].x + g.dir.x + W) % W, y: (g.snake[0].y + g.dir.y + H) % H };
      if (g.snake.some((p) => p.x === head.x && p.y === head.y)) {
        setMode("over");
        setBest((b) => {
          const nb = Math.max(b, g.snake.length - 3);
          try {
            localStorage.setItem("fork-snake-best", String(nb));
          } catch {}
          return nb;
        });
        return;
      }
      g.snake.unshift(head);
      if (head.x === g.food.x && head.y === g.food.y) {
        setScore(g.snake.length - 3);
        placeFood();
      } else g.snake.pop();
      if (!interrupted && performance.now() - g.startedAt > DONE_AFTER) {
        setInterrupted(true);
        setMode("done");
        onDone?.(true);
      }
      draw();
    }, TICK);
    return () => clearInterval(t);
  }, [mode, draw, interrupted, onDone]);

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (mode === "play" && DIRS[k]) {
      e.preventDefault();
      game.current.next = DIRS[k];
    } else if (k === " " || k === "Enter") {
      e.preventDefault();
      if (mode === "done") {
        if (k === "Enter") back();
        else keep();
      } else if (mode !== "play") start();
    }
  };

  const back = () => {
    setMode("start");
    onDone?.(false);
  };
  const keep = () => {
    setMode("play");
    canvas.current?.focus({ preventScroll: true });
  };

  // Swipes on touch screens.
  const touch = useRef<P | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) {
      if (mode !== "play" && mode !== "done") start();
      return;
    }
    game.current.next = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
  };

  return (
    <div className={styles.snake}>
      <div className={styles.snakeHead}>
        <span>Snake</span>
        <span>
          {score} · best {Math.max(best, score)}
        </span>
      </div>
      <div className={styles.snakeBoard}>
        <canvas
          ref={canvas}
          width={W * CELL}
          height={H * CELL}
          tabIndex={0}
          aria-label="Snake. Use the arrow keys to steer, Space to start."
          onKeyDown={onKey}
          onClick={() => mode !== "play" && mode !== "done" && start()}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        {mode !== "play" && (
          <div className={styles.snakeCard}>
            {mode === "done" ? (
              <>
                <b>Claude’s done</b>
                <span>Back to it, or finish your game first?</span>
                <div>
                  <button onClick={back}>
                    <kbd>Enter</kbd> Back to it
                  </button>
                  <button onClick={keep}>
                    <kbd>Space</kbd> Keep playing
                  </button>
                </div>
              </>
            ) : (
              <>
                <b>{mode === "over" ? "Game over" : "Snake"}</b>
                <span>{mode === "over" ? `You scored ${score}.` : "Ready when you are."}</span>
                <div>
                  <button onClick={start}>
                    <kbd>Space</kbd> {mode === "over" ? "Play again" : "Start"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <p className={styles.snakeHint}>← → ↑ ↓ steer · swipe on a phone</p>
    </div>
  );
}
