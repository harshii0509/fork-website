"use client";

import { useEffect } from "react";

// Scroll reveals: anything marked data-reveal gets data-shown once it comes into view, and CSS
// animates it. A bottom margin (not a visibility threshold) means tall things always reveal.
export default function Reveals() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    document.documentElement.dataset.reveals = "on";
    return () => io.disconnect();
  }, []);
  return null;
}
