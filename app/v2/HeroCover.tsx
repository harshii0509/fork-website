"use client";

import { useEffect } from "react";

// The hero's scroll moment: the headline stays pinned (CSS sticky) while the Fork window rises over
// it. This only works out how far along that is and hands it to CSS as two variables on the hero:
// --cover (0..1, straight with the scroll) and --cover-e (the same, eased out). Everything that
// moves reads those, so it tracks the scroll 1:1 and only ever changes transform and opacity.
// On phones (where nothing is pinned) and under reduced motion it leaves the page alone.
export default function HeroCover() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-cover]");
    const copy = hero?.querySelector<HTMLElement>("[data-cover-copy]");
    const stage = hero?.querySelector<HTMLElement>("[data-cover-stage]");
    if (!hero || !copy || !stage) return;
    const off = matchMedia("(max-width: 760px), (prefers-reduced-motion: reduce)");

    // Where the window starts, and where the pinned copy sits: the cover is done when the window's
    // top reaches the copy's top. Measured through offsetTop, so transforms don't throw it off.
    let distance = 1;
    const measure = () => {
      let top = 0;
      for (let el: HTMLElement | null = stage; el; el = el.offsetParent as HTMLElement | null) top += el.offsetTop;
      distance = Math.max(1, top - parseFloat(getComputedStyle(copy).top));
    };

    let frame = 0;
    const paint = () => {
      frame = 0;
      if (off.matches) {
        hero.style.removeProperty("--cover");
        hero.style.removeProperty("--cover-e");
        return;
      }
      const p = Math.min(1, Math.max(0, scrollY / distance));
      hero.style.setProperty("--cover", p.toFixed(4));
      hero.style.setProperty("--cover-e", (1 - Math.pow(1 - p, 3)).toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    paint();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    off.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      off.removeEventListener("change", onResize);
      hero.style.removeProperty("--cover");
      hero.style.removeProperty("--cover-e");
    };
  }, []);
  return null;
}
