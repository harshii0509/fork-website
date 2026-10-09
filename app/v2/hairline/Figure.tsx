"use client";

import { laptop, loupe, query, terminal } from "@lucasmarkes/hairline";
import { useEffect, useRef } from "react";
import { useSeen } from "../hooks";
import beforeafter from "./beforeafter";
import folders from "./folders";
import HL from "./kernel";
import numerals from "./numerals";
import swatchfan from "./swatchfan";
import tabs from "./tabs";

// A Hairline line figure (@lucasmarkes/hairline, MIT): Fork's own (drawn with the hairline-create kit, in this
// folder) or one of the package's. The first time it scrolls into view it plays its tour once, an unseen
// pointer visiting a few parts, then rests and answers your pointer. On a touch screen a tap plays it again.
// With reduced motion it rests and still answers. Its colours come from the --hairline-* variables around it.

type Own = {
  name: string;
  means: string;
  range: [number, number, number];
  tour: ([number, number] | null)[] | null;
  mount: (ctx: { stage: HTMLElement; svg: SVGSVGElement; read: { textContent: string } }, value: number) => { set(v: number): void; destroy(): void };
};
type Running = { play(): void; destroy(): void };

const OWN = { tabs, folders, beforeafter, swatchfan, numerals } as unknown as Record<string, Own>;
const STOCK = { laptop, loupe, query, terminal };

export type FigureName = "tabs" | "folders" | "beforeafter" | "swatchfan" | "numerals" | keyof typeof STOCK;

// The figure's own number for an intensity from 0 to 1, read on its range (as the kit's bench does).
const valueOf = ([lo, mid, hi]: Own["range"], k: number) => (k <= 0.5 ? lo + (k / 0.5) * (mid - lo) : mid + ((k - 0.5) / 0.5) * (hi - mid));

function mountOwn(el: HTMLElement, f: Own, intensity: number, label: string): Running {
  HL.inject(document);
  el.setAttribute("data-hairline", f.name);
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", label);
  const svg = HL.mk("svg", { viewBox: "0 0 400 320", "aria-hidden": "true" }, el) as SVGSVGElement;
  const fig = f.mount({ stage: el, svg, read: { textContent: "" } }, valueOf(f.range, intensity));
  const stops = f.tour ?? HL.LAP;
  let lap: { stop(): void } | null = null;
  const stop = () => {
    lap?.stop();
    lap = null;
  };
  return {
    // One lap: the tour ends on its leave (null), or on its last stop.
    play() {
      stop();
      lap = HL.tour(el, stops, (i: number) => {
        if (stops[i] === null || i === stops.length - 1) queueMicrotask(stop);
      });
    },
    destroy() {
      stop();
      fig.destroy();
      svg.remove();
      ["data-hairline", "role", "aria-label"].forEach((a) => el.removeAttribute(a));
    },
  };
}

// The package's figures loop when they play. One lap is over when the read-out comes back to its rest words.
function mountStock(el: HTMLElement, name: keyof typeof STOCK, intensity: number, label: string): Running {
  let rest: string | null = null;
  let moved = false;
  let playing = false;
  const fig = STOCK[name](el, {
    intensity,
    label,
    onRead: (text) => {
      if (rest === null) rest = text;
      else if (text !== rest) moved = true;
      else if (moved && playing) {
        playing = false;
        fig.update({ play: false });
      }
    },
  });
  return {
    play() {
      moved = false;
      playing = true;
      fig.update({ play: true });
    },
    destroy: () => fig.destroy(),
  };
}

export default function Figure({ name, label, intensity = 0.5, className, digits }: { name: FigureName; label: string; intensity?: number; className?: string; digits?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fig = useRef<Running | null>(null);
  const seen = useSeen(ref, "0px 0px -25% 0px");
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const own = OWN[name];
    fig.current = own ? mountOwn(el, own, intensity, label) : mountStock(el, name as keyof typeof STOCK, intensity, label);
    played.current = false;
    return () => {
      fig.current?.destroy();
      fig.current = null;
    };
  }, [name, intensity, label, digits]);

  useEffect(() => {
    if (!seen || played.current) return;
    played.current = true;
    fig.current?.play();
  }, [seen]);

  return (
    <div
      ref={ref}
      className={className}
      data-digits={digits}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") fig.current?.play();
      }}
    />
  );
}
