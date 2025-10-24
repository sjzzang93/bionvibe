"use client";

import { useEffect, useState } from "react";

type ParallaxOptions = {
  maxOffset?: number;
};

type MousePosition = {
  x: number;
  y: number;
};

/**
 * Provides an animated mouse position for parallax effects that automatically
 * disable on touch or reduced-motion devices so mobile users do not pay for
 * desktop-only visuals.
 */
export function useParallax({ maxOffset = 20 }: ParallaxOptions = {}) {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateEnabled = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    updateEnabled();
    pointerQuery.addEventListener("change", updateEnabled);
    motionQuery.addEventListener("change", updateEnabled);

    return () => {
      pointerQuery.removeEventListener("change", updateEnabled);
      motionQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setMousePos({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({
        x: (event.clientX / window.innerWidth - 0.5) * maxOffset,
        y: (event.clientY / window.innerHeight - 0.5) * maxOffset
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, maxOffset]);

  return { mousePos, enabled };
}
