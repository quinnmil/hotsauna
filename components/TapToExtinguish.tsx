"use client";

import { useEffect, useRef } from "react";
import { extinguishSauna } from "@/app/actions";

const TAPS_REQUIRED = 5;
const WINDOW_MS = 2000;
const IGNORE_SELECTOR = "form, button, input, textarea, a, [role='button']";

export function TapToExtinguish() {
  const tapsRef = useRef<number[]>([]);
  const firingRef = useRef(false);

  useEffect(() => {
    const onTap = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(IGNORE_SELECTOR)) return;

      const now = Date.now();
      const fresh = tapsRef.current.filter((t) => now - t < WINDOW_MS);
      fresh.push(now);
      tapsRef.current = fresh;

      if (fresh.length >= TAPS_REQUIRED && !firingRef.current) {
        firingRef.current = true;
        tapsRef.current = [];
        extinguishSauna().finally(() => {
          firingRef.current = false;
        });
      }
    };

    window.addEventListener("pointerdown", onTap);
    return () => window.removeEventListener("pointerdown", onTap);
  }, []);

  return null;
}
