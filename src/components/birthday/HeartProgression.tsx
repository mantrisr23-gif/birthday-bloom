import { useEffect, useState, useRef, useCallback } from "react";

interface HeartProgressionProps {
  stage: 1 | 2 | 3 | 4;
  onRevealComplete?: () => void;
}

// RECTIFIED: Changed Heart Path to a Coffee Mug Path
const MugPath = "M6,4 L14,4 L14,14 Q14,16 12,16 L8,16 Q6,16 6,14 Z M14,6 Q17,6 17,9 Q17,12 14,12";
const FullMugPath = "M60,40 L140,40 L140,140 Q140,160 120,160 L80,160 Q60,160 60,140 Z M140,60 Q170,60 170,90 Q170,120 140,120";

const MugSVG = ({ stage, glowing }: { stage: number; glowing: boolean }) => {
  // We'll simulate the mug "filling up" with coffee based on the stage
  const fillHeight = stage * 25; // 25%, 50%, 75%, 100%

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: glowing ? "drop-shadow(0 0 20px #3b82f6)" : "none" }}>
      <defs>
        <linearGradient id="coffeeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6F4E37" />
          <stop offset="100%" stopColor="#3C2A21" />
        </linearGradient>
      </defs>
      {/* Mug Outline */}
      <path d={FullMugPath} fill="none" stroke="#ffffff" strokeWidth="4" />
      {/* Coffee Fill Level */}
      <rect x="65" y={140 - (stage * 25)} width="70" height={stage * 25} fill="url(#coffeeGrad)" className="transition-all duration-1000" />
      {stage === 4 && <text x="75" y="100" fill="white" fontSize="12" fontWeight="bold">FULL</text>}
    </svg>
  );
};

const FinalRoastReveal = ({ onDone }: { onDone: () => void }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 1000);
    const t2 = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="animate-bounce text-6xl mb-4">☕</div>
      {showText && (
        <div className="animate-love-text-reveal">
          <span className="font-display text-2xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            {`Happy Birthday, Ghost Junior Akash!`}
          </span>
          <p className="text-white mt-4 italic">"Energy Level: 100% (Temporarily)"</p>
        </div>
      )}
    </div>
  );
};

export const HeartProgression = ({ stage, onRevealComplete }: HeartProgressionProps) => {
  if (stage === 4) {
    return (
      <div className="relative flex flex-col items-center justify-center w-full min-h-[200px]">
        <FinalRoastReveal onDone={() => onRevealComplete?.()} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="w-16 h-16 md:w-20 md:h-20 transition-all duration-1000">
        <MugSVG stage={stage} glowing={stage === 3} />
      </div>
      <p className="text-[10px] text-blue-300 mt-1 uppercase tracking-tighter">
        {stage === 1 ? "Loading tea..." : stage === 2 ? "Heating water..." : "Brewing roast..."}
      </p>
    </div>
  );
};
