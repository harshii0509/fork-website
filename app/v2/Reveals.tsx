"use client";

import { useEffect } from "react";

// Scroll reveals: anything marked data-reveal gets data-shown once it comes into view, and CSS
// animates it. A bottom margin (not a visibility threshold) means tall things always reveal.
// A jump (a link, a prompt command, a fast fling) can carry something past the view without it
// ever crossing in, so a sweep on scroll also shows everything already above the reveal line.
export default function Reveals() {
  useEffect(() => {
    const show = (el: Element) => {
      el.setAttribute("data-shown", "");
      io.unobserve(el);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && show(e.target)), {
      rootMargin: "0px 0px -12% 0px",
    });
    let frame = 0;
    const sweep = () => {
      frame = 0;
      const line = innerHeight * 0.88;
      document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => {
        if (el.getBoundingClientRect().top < line) show(el);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sweep);
    };
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    document.documentElement.dataset.reveals = "on";
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
