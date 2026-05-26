"use client";

import { useEffect, useState } from "react";
import { formatRelative } from "@/lib/time";

export function RelativeTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState(() => formatRelative(iso));

  useEffect(() => {
    const tick = () => setLabel(formatRelative(iso));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [iso]);

  return <span suppressHydrationWarning>{label}</span>;
}
