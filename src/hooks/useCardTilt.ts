import { useCallback, useRef } from "react";

export function useCardTilt(maxDeg = 3) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const { innerWidth, innerHeight } = window;
      const xRotation = -((e.clientY - innerHeight / 2) / (innerHeight / 2)) * maxDeg;
      const yRotation = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * maxDeg;
      el.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    },
    [maxDeg]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
  }, []);

  return { ref, onMove, onLeave };
}
