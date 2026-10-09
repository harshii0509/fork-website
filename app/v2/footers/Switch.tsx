"use client";

import { type ReactNode, useEffect, useState } from "react";

// Shows one of the footers while we choose: ?footer=a, b or c. A shows until the address is read.
export default function Switch({ a, b, c }: { a: ReactNode; b: ReactNode; c: ReactNode }) {
  const [pick, setPick] = useState("a");
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("footer");
    if (f === "b" || f === "c") setPick(f);
  }, []);
  return <>{pick === "b" ? b : pick === "c" ? c : a}</>;
}
