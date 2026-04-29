import { useState, useEffect, useCallback, useMemo, CSSProperties } from "react";
import { Cake as CakeIcon, Flame, Heart, Sparkles } from "lucide-react";
import { useConfetti } from "./Confetti";
import { useSoundManager } from "./SoundManager";
import { KineticText } from "./KineticText";

type Phase =
  | "select"
  | "blow-intro"
  | "blowing"
  | "wish"
  | "knife-enter"
  | "cutting"
  | "burst"
  | "quotes";

/* ── Updated Cake designs for Akash ── */
const CAKE_OPTIONS = [
  {
    id: "chocolate",
    name: "Overtime Dark Cocoa",
    layers: ["hsl(15,60%,20%)", "hsl(15,50%,30%)", "hsl(20,40%,40%)"],
    frosting: "hsl(30,70%,60%)",
    accent: "hsl(45,100%,50%)",
    emoji: "🍫",
    image: "/assets/birthday/cake-maroon.png",
  },
  {
    id: "blue-velvet",
    name: "Junior Blue Velvet",
    layers: ["hsl(210,60%,40%)", "hsl(210,55%,50%)", "hsl(220,50%,60%)"],
    frosting: "hsl(210,80%,85%)",
    accent: "hsl(190,80%,50%)",
    emoji: "👕",
    image: "/assets/birthday/cake-green.png", 
  },
  {
    id: "royal",
    name: "Royal Ghost Velvet",
    layers: ["hsl(270,50%,35%)", "hsl(280,45%,50%)", "hsl(290,40%,60%)"],
    frosting: "hsl(45,100%,75%)",
    accent: "hsl(45,100%,60%)",
    emoji: "👑",
    image: "/assets/birthday/birthday-gold.png",
  },
  {
    id: "coffee",
    name: "Tea Break Special",
    layers: ["hsl(30,40%,30%)", "hsl(30,30%,40%)", "hsl(30,40%,50%)"],
    frosting: "hsl(40,50%,80%)",
    accent: "hsl(20,85%,65%)",
    emoji: "☕",
    image: "/assets/birthday/cake-maroon.png",
  },
];

type CakeOption = (typeof CAKE_OPTIONS)[number];

/* ── Spark particles ── */
const CutSparks = ({ count }: { count: number }) => {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + Math.random() * 20 - 10,
        distance: 40 + Math.random() * 60,
        size: 3 + Math.random() * 4,
        duration: 0.6 + Math.random() * 0.4,
        hue: [210, 45, 270, 200][i % 4],
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none">
      {sparks.map((s) => (
        <div
          key={s.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: s.size,
            height: s.size,
            background: `hsl(${s.hue}, 85%, 65%)`,
            boxShadow: `0 0 8px hsl(${s.hue}, 85%, 65%), 0 0 16px hsl(${s.hue}, 85%, 65%, 0.5)`,
            animation: `cut-spark ${s.duration}s ease-out forwards`,
            "--spark-x": `${Math.cos((s.angle * Math.PI) / 180) * s.distance}px`,
            "--spark-y": `${Math.sin((s.angle * Math.PI) / 180) * s.distance}px`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
};

/* ── Burst particles ── */
const BurstParticles = ({ count }: { count: number }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i,
        distance: 80 + Math.random() * 120,
        size: 4 + Math.random() * 6,
        duration: 1 + Math.random() * 0.8,
        delay: Math.random() * 0.3,
        hue: [210, 45, 270, 200, 30, 160][i % 6],
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `hsl(${p.hue}, 85%, 65%)`,
            boxShadow: `0 0 12px hsl(${p.hue}, 85%, 65%), 0 0 24px hsl(${p.hue}, 85%, 65%, 0.4)`,
            animation: `cut-spark ${p.duration}s ease-out ${p.delay}s forwards`,
            "--spark-x": `${Math.cos((p.angle * Math.PI) / 180) * p.distance}px`,
            "--spark-y": `${Math.sin((p.angle * Math.PI) / 180) * p.distance}px`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
};

/* ── SVG Cake ── */
const CakeSVG = ({ cake, split, candlesLit }: { cake: CakeOption; split: boolean; candlesLit: boolean }) => (
  <svg viewBox="0 0 200 200" className="w-56 sm:w-64 md:w-80 mx-auto" style={{ filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.5))" }}>
    <defs>
      <filter id="glassBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>
      <filter id="candleGlow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="layerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.2" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
        <stop offset="100%" stopColor="black" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    <ellipse cx="100" cy="185" rx="90" ry="12" fill="black" opacity="0.2" />

    {/* Cake Layers */}
    <g style={{ transform: split ? "translateX(-12px) rotate(-3deg)" : "translateX(0) rotate(0)", transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      <rect x="20" y="110" width="80" height="65" rx="10" fill={cake.layers[0]} />
      <rect x="20" y="110" width="80" height="65" rx="10" fill="url(#layerGrad)" />
      <path d="M20,110 Q60,125 100,110 L100,125 Q60,140 20,125 Z" fill={cake.frosting} opacity="0.9" />
    </g>
    <g style={{ transform: split ? "translateX(12px) rotate(3deg)" : "translateX(0) rotate(0)", transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
      <rect x="100" y="110" width="80" height="65" rx="10" fill={cake.layers[0]} />
      <rect x="100" y="110" width="80" height="65" rx="10" fill="url(#layerGrad)" />
      <path d="M100,110 Q140,125 180,110 L180,125 Q140,140 100,125 Z" fill={cake.frosting} opacity="0.9" />
    </g>

    {/* Candles */}
    {[75, 100, 125].map((cx, i) => (
      <g key={i}>
        <rect x={cx - 2} y="5" width="4" height="28" rx="2" fill={`hsl(${i * 40 + 210}, 80%, 65%)`} />
        {candlesLit ? (
          <g className="animate-flame-premium" filter="url(#candleGlow)">
            <ellipse cx={cx} cy="-2" rx="6" ry="12" fill={cake.accent} />
            <ellipse cx={cx} cy="-1" rx="3" ry="7" fill="white" />
          </g>
        ) : (
          <circle cx={cx} cy="5" r="2" fill="white" opacity="0.3" className="animate-fade-out" />
        )}
      </g>
    ))}
  </svg>
);

const KnifeSVG = ({ phase }: { phase: Phase }) => {
  const animClass =
    phase === "knife-enter" ? "animate-knife-enter" :
      phase === "cutting" ? "animate-knife-cut" : "";

  return (
    <div className={`absolute left-1/2 -translate-x-1/2 z-10 ${animClass}`}
      style={{ top: phase === "select" ? "-150px" : undefined }}>
      <svg viewBox="0 0 30 120" className="w-8 sm:w-10 md:w-12">
        <rect x="10" y="0" width="10" height="40" rx="4" fill="hsl(30, 40%, 30%)" />
        <polygon points="10,43 20,43 18,115 12,115" fill="hsl(0, 0%, 80%)" />
      </svg>
    </div>
  );
};

const CakeCard = ({ cake, index, onSelect }: { cake: CakeOption; index: number; onSelect: () => void }) => (
  <button
    onClick={onSelect}
    className="group relative flex flex-col items-center gap-3 p-2 rounded-2xl border border-border/30 backdrop-blur-sm transition-all duration-500 hover:scale-105"
    style={{ background: "hsl(220, 20%, 15%, 0.8)", width: "160px" }}
  >
    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
      <img src={cake.image} alt={cake.name} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 right-2 text-2xl">{cake.emoji}</div>
    </div>
    <span className="font-display text-sm font-bold text-foreground/90">{cake.name}</span>
  </button>
);

/* ── ROAST QUOTES FOR AKASH ── */
const quotes = [
  { text: "To Akash...", animation: "zoom-in" as const },
  { text: "The Ghost of the Ward", animation: "pop-out" as const },
  { text: "May you finally finish a task on time!", animation: "stagger-up" as const },
  { text: "Happy Birthday, Junior!", animation: "typewriter-burst" as const },
  { text: "Now go back to work, Akash!", animation: "float" as const },
];

export const CakeCutting = () => {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedCake, setSelectedCake] = useState<CakeOption | null>(null);
  const [candlesLit, setCandlesLit] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(-1);
  const { fireCannon } = useConfetti();
  const { playBoom, playReveal, playPop, playWhoosh } = useSoundManager();

  const handleSelectCake = useCallback((cake: CakeOption) => {
    setSelectedCake(cake);
    playPop();
    setPhase("blow-intro");
  }, [playPop]);

  const handleBlow = useCallback(() => {
    if (phase !== "blow-intro") return;
    setPhase("blowing");
    playWhoosh();
    setCandlesLit(false);

    setTimeout(() => { setPhase("wish"); playReveal(); }, 1200);
    setTimeout(() => { setPhase("knife-enter"); }, 4500);
    setTimeout(() => { setPhase("cutting"); playBoom(); }, 5500);
    setTimeout(() => { setPhase("burst"); fireCannon(); playReveal(); }, 6300);
    setTimeout(() => { setPhase("quotes"); setQuoteIndex(0); }, 7800);
  }, [phase, fireCannon, playBoom, playReveal, playWhoosh]);

  useEffect(() => {
    if (phase !== "quotes" || quoteIndex < 0 || quoteIndex >= quotes.length) return;
    const t = setTimeout(() => {
      if (quoteIndex < quotes.length - 1) setQuoteIndex((i) => i + 1);
    }, 3500);
    return () => clearTimeout(t);
  }, [phase, quoteIndex]);

  const cake = selectedCake || CAKE_OPTIONS[0];

  return (
    <>
      {phase !== "select" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ background: "hsl(220, 60%, 5%, 0.9)" }}>
          <div className="relative w-full max-w-lg px-4 flex flex-col items-center">
            
            {(phase === "blow-intro" || phase === "blowing") && (
              <div className="flex flex-col items-center gap-6">
                <p className="font-display text-xl text-foreground/90 text-center animate-pulse">
                  🌬️ Make a wish (probably for a holiday) and blow!
                </p>
                <CakeSVG cake={cake} split={false} candlesLit={candlesLit} />
                {phase === "blow-intro" && (
                  <button onClick={handleBlow} className="px-8 py-4 rounded-full text-lg font-bold bg-blue-600 text-white animate-bounce">
                    Blow the Candles!
                  </button>
                )}
              </div>
            )}

            {phase === "wish" && (
              <div className="flex flex-col items-center gap-8 text-center">
                <CakeSVG cake={cake} split={false} candlesLit={false} />
                <p className="font-display text-2xl font-bold text-yellow-400">
                  🌟 Wish made: More Tea Breaks for Akash 🌟
                </p>
              </div>
            )}

            {(phase === "knife-enter" || phase === "cutting" || phase === "burst") && (
              <div className={`relative ${phase === "cutting" ? "animate-shake" : ""}`}>
                {(phase === "knife-enter" || phase === "cutting") && <KnifeSVG phase={phase} />}
                <CakeSVG cake={cake} split={phase === "burst"} candlesLit={false} />
                {phase === "burst" && <div className="absolute inset-0 flex items-center justify-center text-4xl">🤣</div>}
              </div>
            )}

            {phase === "quotes" && (
              <div className="flex flex-col items-center gap-8 text-center">
                <CakeSVG cake={cake} split={true} candlesLit={false} />
                {quoteIndex >= 0 && (
                  <div className="min-h-[80px]">
                    <p className="text-xl md:text-2xl font-display font-bold text-white">
                      <KineticText text={quotes[quoteIndex].text} animation={quotes[quoteIndex].animation} delay={200} />
                    </p>
                  </div>
                )}
              </div>
            )}

            {(phase === "quotes" && quoteIndex >= quotes.length - 1) && (
              <button onClick={() => setPhase("select")} className="mt-8 px-6 py-3 rounded-full text-sm font-semibold text-white border border-white/40 hover:bg-white/10">
                ✕ Finish the Roast
              </button>
            )}
          </div>
        </div>
      )}

      <section className="relative z-20 py-20 px-4">
        <h3 className="font-display text-2xl md:text-4xl font-bold text-center mb-8 text-blue-400">
          🎂 Choose Akash's Cake
        </h3>
        <div className="flex flex-wrap justify-center gap-6 max-w-xl mx-auto">
          {CAKE_OPTIONS.map((c, i) => (
            <CakeCard key={c.id} cake={c} index={i} onSelect={() => handleSelectCake(c)} />
          ))}
        </div>
      </section>
    </>
  );
};
