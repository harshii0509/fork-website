"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "./hooks";
import styles from "./v2.module.css";

// Paper Shaders (paper.design) behind a panel. Each canvas is a WebGL context and browsers cap
// how many a page may hold, so a shader mounts only once its panel comes near the screen. Paper
// pauses it off screen and in hidden tabs by itself. Until it loads (or with no WebGL) the panel
// shows its flat `base` colour.

const load = <K extends "GrainGradient" | "Dithering" | "DotGrid" | "PaperTexture" | "Metaballs">(k: K) =>
  dynamic(() => import("@paper-design/shaders-react").then((m) => m[k] as React.ComponentType<Record<string, unknown>>), {
    ssr: false,
  });

const SHADERS = {
  GrainGradient: load("GrainGradient"),
  Dithering: load("Dithering"),
  DotGrid: load("DotGrid"),
  PaperTexture: load("PaperTexture"),
  Metaballs: load("Metaballs"),
};

export type ShaderName = keyof typeof SHADERS;

export default function ShaderPanel({
  shader,
  params,
  base,
  className = "",
  children,
}: {
  shader: ShaderName;
  params: Record<string, unknown>;
  base: string; // flat colour under the canvas, and the fallback
  className?: string;
  children?: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, "300px");
  const [mounted, setMounted] = useState(false);
  if (near && !mounted) setMounted(true); // once mounted, stay mounted: remounting would restart it
  const still = useReducedMotion();
  const Shader = SHADERS[shader];

  return (
    <div ref={box} className={`${styles.shaderPanel} ${className}`} style={{ backgroundColor: base }}>
      {mounted && (
        <Shader
          className={styles.shaderCanvas}
          {...params}
          speed={still ? 0 : (params.speed ?? 1)}
          frame={still ? 8000 : undefined}
          maxPixelCount={1600 * 1000}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
