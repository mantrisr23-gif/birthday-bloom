import { useCallback } from "react";
import confetti from "canvas-confetti";

export const useConfetti = () => {
  const fireConfetti = useCallback((options?: confetti.Options) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      // RECTIFIED: Removed the pink (#e84393) for a professional blue (#3b82f6)
      colors: ["#3b82f6", "#a855f7", "#f59e0b", "#38bdf8", "#f97316", "#34d399"],
      ...options,
    });
  }, []);

  const fireCannon = useCallback(() => {
    const end = Date.now() + 2000;
    const fire = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        // RECTIFIED: Using the "Akash Theme" colors
        colors: ["#3b82f6", "#a855f7", "#f59e0b"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#38bdf8", "#f97316", "#34d399"],
      });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);

  const fireStars = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 360,
      ticks: 100,
      origin: { x: 0.5, y: 0.5 },
      shapes: ["star"],
      // Keep these gold/yellow - it looks like "5-star" ratings Akash probably doesn't get!
      colors: ["#f59e0b", "#fbbf24", "#fcd34d"],
      scalar: 1.5,
    });
  }, []);

  return { fireConfetti, fireCannon, fireStars };
};
