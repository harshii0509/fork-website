"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "./hooks";
import styles from "./v2.module.css";

// Paper Shaders (paper.design) behind a panel. Each canvas is a WebGL context and browsers cap
// how many a page may hold, so a shader mounts only once its panel comes near the screen. Paper
// pauses it off screen and in hidden tabs by itself. Until it loads (or with no WebGL) the panel
// shows its flat `base` colour. The pointer nudges the pattern a little, on fine pointers only.

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
  steer = 0.08,
}: {
  shader: ShaderName;
  params: Record<string, unknown>;
  base: string; // flat colour under the canvas, and the fallback
  className?: string;
  children?: ReactNode;
  steer?: number; // how far the pointer moves the pattern (0 = not at all)
}) {
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, "300px");
  const [mounted, setMounted] = useState(false);
  if (near && !mounted) setMounted(true); // once mounted, stay mounted: remounting would restart it
  const still = useReducedMotion();
  const Shader = SHADERS[shader];

  // Ease the pattern's offset toward the pointer, straight on the shader's uniforms (no re-render).
  useEffect(() => {
    if (!steer || still || !matchMedia("(pointer: fine)").matches) return;
    const el = box.current;
    if (!el) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const baseX = Number(params.offsetX ?? 0), baseY = Number(params.offsetY ?? 0);
    const frame = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      const mount = (el.querySelector("[data-paper-shader]") as (HTMLElement & { paperShaderMount?: { setUniforms(u: Record<string, number>): void } }) | null)?.paperShaderMount;
      mount?.setUniforms({ u_offsetX: baseX + x, u_offsetY: baseY + y });
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0005 ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      tx = ((e.clientX - r.left) / r.width - 0.5) * steer;
      ty = -((e.clientY - r.top) / r.height - 0.5) * steer;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [steer, still, params.offsetX, params.offsetY]);

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
