import { useState, useEffect, useRef, useCallback } from "react";
import { useConfetti } from "./Confetti";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import { KineticText } from "./KineticText";
import { TypeWriter } from "./TypeWriter";
import { FakeChatScene } from "./FakeChatScene";
import { HeartProgression } from "./HeartProgression";
import { useSoundManager } from "./SoundManager";

interface CinematicIntroProps {
  onComplete: () => void;
}

type Scene = "storytelling" | "fake-chat" | "post-chat" | "reveal-sequence" | "done";
type RevealStep = "dear-name" | "grand-reveal" | "final-message";

const storyAnimations: Array<"zoom-in" | "pop-out" | "stagger-up" | "float" | "wave" | "typewriter-burst"> = [
  "stagger-up", "float", "wave", "zoom-in",
];

const postChatAnimations: Array<"zoom-in" | "pop-out" | "stagger-up" | "float" | "wave" | "typewriter-burst"> = [
  "pop-out", "typewriter-burst", "zoom-in",
];

export const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const [scene, setScene] = useState<Scene>("storytelling");
  const [storyLine, setStoryLine] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [postChatLine, setPostChatLine] = useState(0);
  const [revealStep, setRevealStep] = useState<RevealStep>("dear-name");
  const [shaking, setShaking] = useState(false);
  const [emojiBursts, setEmojiBursts] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [ringPulse, setRingPulse] = useState(false);
  const [finalLineIndex, setFinalLineIndex] = useState(0);
  const [heartStage, setHeartStage] = useState<1 | 2 | 3 | 4>(2);
  const [flashWhite, setFlashWhite] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { fireConfetti, fireCannon, fireStars } = useConfetti();
  const { playType, playWhoosh, playReveal, playPop, playBoom } = useSoundManager();

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }, []);

  const spawnEmojiBurst = useCallback(() => {
    const burstEmojis = ["🎉", "😂", "✨", "☕", "⭐", "🌟", "🔥", "🎈", "🥳", "💤"];
    const bursts = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      emoji: burstEmojis[Math.floor(Math.random() * burstEmojis.length)],
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    }));
    setEmojiBursts(bursts);
    setTimeout(() => setEmojiBursts([]), 2000);
  }, []);

  const triggerRingPulse = useCallback(() => {
    setRingPulse(true);
    setTimeout(() => setRingPulse(false), 1200);
  }, []);

  const triggerFlash = useCallback(() => {
    setFlashWhite(true);
    setTimeout(() => setFlashWhite(false), 300);
  }, []);

  // AKASH ROAST LINES
  const storyLines = [
    "There's a certain junior named Akash we need to talk about...",
    "Someone who makes simple tasks look incredibly difficult...",
    "Someone who specializes in 15-minute tea breaks...",
    "We could have just bought you a simple samosa, Akash...",
  ];

  const postChatLines = [
    "But you aren't just any junior, Akash...",
    "You are the legend who disappears at 5:01 PM sharp...",
    "So we made this to officially roast you on your birthday 😂",
  ];

  const finalLines = [
    "Happy Birthday, Akash!",
    "We wanted to get you a real gift...",
    "But we figured another nap was more your style 😴",
    "Thanks for keeping the ward entertaining...",
    "May your shifts be short and your tea breaks be long.",
    "Now don't get too shy... and get back to work! 🏃‍♂️💨",
  ];

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Phase 1: Storytelling
  useEffect(() => {
    if (scene !== "storytelling") return;
    clearTimers();
    storyLines.forEach((_, i) => {
      addTimer(() => { setStoryLine(i); playType(); }, i * 5000);
    });
    addTimer(() => setHeartStage(2), 5000);
    addTimer(() => { playWhoosh(); setScene("fake-chat"); }, storyLines.length * 5000);
  }, [scene]);

  // Phase 3: Post-chat
  useEffect(() => {
    if (scene !== "post-chat") return;
    clearTimers();
    setHeartStage(3);
    postChatLines.forEach((_, i) => {
      addTimer(() => { setPostChatLine(i); playType(); }, i * 4500);
    });
    addTimer(() => {
      playReveal();
      fireStars();
      triggerFlash();
      setHeartStage(4);
      setScene("reveal-sequence");
      setRevealStep("dear-name");
    }, postChatLines.length * 4500);
  }, [scene]);

  // Phase 4: Reveal
  useEffect(() => {
    if (scene !== "reveal-sequence") return;
    clearTimers();

    addTimer(() => {
      setRevealStep("grand-reveal");
      playBoom();
      fireCannon();
      triggerShake();
      triggerFlash();
      spawnEmojiBurst();
      triggerRingPulse();
    }, 6000);
    addTimer(() => { playPop(); fireConfetti({ particleCount: 200, spread: 160 }); triggerShake(); }, 8000);
    addTimer(() => { fireStars(); spawnEmojiBurst(); }, 9500);
    addTimer(() => { playPop(); fireConfetti({ particleCount: 150, spread: 120, origin: { x: 0.3, y: 0.5 } }); triggerRingPulse(); }, 11000);
    addTimer(() => { fireConfetti({ particleCount: 100, spread: 360, origin: { x: 0.5, y: 0.5 } }); spawnEmojiBurst(); }, 12000);

    addTimer(() => { setRevealStep("final-message"); setFinalLineIndex(0); playType(); }, 13000);
    finalLines.forEach((_, i) => {
      if (i > 0) addTimer(() => { setFinalLineIndex(i); playType(); }, 13000 + i * 4000);
    });

    const endTime = 13000 + finalLines.length * 4000;
    addTimer(() => { playBoom(); fireConfetti({ particleCount: 300, spread: 180 }); fireCannon(); }, endTime);
    addTimer(() => setFadeOut(true), endTime + 2000);
    addTimer(() => { setScene("done"); onComplete(); }, endTime + 3500);
  }, [scene]);

  const getBackground = () => {
    if (scene === "storytelling") return "url('/assets/birthday/birthday-cute.png')";
    if (scene === "post-chat") return "url('/assets/birthday/birthday-maroon.png')";
    if (revealStep === "grand-reveal") return "url('/assets/birthday/birthday-gold.png')";
    return "none";
  };

  const handleChatComplete = useCallback(() => {
    playWhoosh();
    setScene("post-chat");
    setPostChatLine(0);
  }, [playWhoosh]);

  if (scene === "done") return null;

  const storyLineStyles = [
    { className: "text-lg md:text-2xl lg:text-3xl italic font-light", style: { color: "hsl(280, 20%, 85%)", textShadow: "0 2px 10px rgba(0,0,0,0.3)" } as React.CSSProperties },
    { className: "text-xl md:text-3xl lg:text-4xl font-normal", style: { color: "hsl(330, 80%, 85%)", textShadow: "0 2px 15px rgba(0,0,0,0.4)" } as React.CSSProperties },
    { className: "text-xl md:text-3xl lg:text-[2.5rem] font-semibold", style: { color: "hsl(45, 100%, 80%)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" } as React.CSSProperties },
    { className: "text-lg md:text-2xl lg:text-3xl font-light", style: { color: "hsl(200, 90%, 85%)", textShadow: "0 2px 10px rgba(0,0,0,0.3)" } as React.CSSProperties },
  ];

  const postChatStyles = [
    { className: "text-2xl md:text-4xl lg:text-5xl font-bold", style: { color: "hsl(330, 95%, 75%)", textShadow: "0 4px 20px rgba(0,0,0,0.5)" } as React.CSSProperties },
    { className: "text-2xl md:text-4xl lg:text-5xl font-extrabold", style: { color: "hsl(45, 100%, 75%)", textShadow: "0 4px 25px rgba(0,0,0,0.5)" } as React.CSSProperties },
    { className: "text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[hsl(330,90%,70%)] via-[hsl(45,100%,75%)] to-[hsl(270,70%,70%)] bg-clip-text text-transparent animate-gradient-shift", style: { filter: "drop-shadow(0 4px 15px rgba(0,0,0,0.3))" } as React.CSSProperties },
  ];

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center transition-all duration-1000 animate-bg-shift ${fadeOut ? "opacity-0" : "opacity-100"} ${shaking ? "animate-screen-shake" : ""}`}
      style={{
        background: getBackground() !== "none"
          ? `${getBackground()} center/cover no-repeat`
          : "linear-gradient(135deg, hsl(280, 60%, 12%) 0%, hsl(300, 45%, 18%) 25%, hsl(330, 55%, 15%) 50%, hsl(270, 55%, 12%) 75%, hsl(280, 60%, 12%) 100%)",
      }}
    >
      {getBackground() !== "none" && <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />}
      {flashWhite && <div className="fixed inset-0 z-[60] bg-white/20 pointer-events-none animate-flash" />}

      <Sparkles count={15} />

      {/* Emoji bursts */}
      {emojiBursts.map((b) => (
        <div key={b.id} className="fixed pointer-events-none z-50 text-3xl md:text-5xl animate-emoji-burst" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          {b.emoji}
        </div>
      ))}

      {/* Phase 1: Storytelling */}
      {scene === "storytelling" && (
        <div className="relative z-50 text-center max-w-3xl mx-auto px-6">
          <div className="text-3xl mb-8 animate-pulse opacity-60">💭</div>
          {storyLines.map((line, i) => (
            <p
              key={i}
              className={`font-display leading-relaxed mb-6 transition-all duration-1000 ${(storyLine >= i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={(storyLineStyles[i] || storyLineStyles[0]).style}
            >
              {storyLine >= i && <TypeWriter text={line} speed={70} delay={i === storyLine ? 300 : 0} cursor={storyLine === i} />}
            </p>
          ))}
        </div>
      )}

      {/* Phase 2: Chat */}
      {scene === "fake-chat" && <FakeChatScene onComplete={handleChatComplete} />}

      {/* Phase 3: Post-chat */}
      {scene === "post-chat" && (
        <div className="text-center max-w-3xl mx-auto px-6 animate-slide-up-fade">
          <div className="mb-8 flex justify-center text-4xl">🤣</div>
          {postChatLines.slice(0, postChatLine + 1).map((line, i) => {
            const s = postChatStyles[i] || postChatStyles[0];
            return (
              <p key={i} className={`font-display leading-relaxed mb-6 ${s.className}`} style={s.style}>
                <KineticText text={line} animation={postChatAnimations[i] || "pop-out"} delay={i === postChatLine ? 300 : 0} />
              </p>
            );
          })}
        </div>
      )}

      {/* Phase 4: Reveal */}
      {scene === "reveal-sequence" && (
        <>
          {revealStep === "dear-name" && (
            <div className="text-center animate-bounce-in">
              <p className="text-2xl md:text-4xl text-muted-foreground mb-4 font-display italic">Brace yourself...</p>
              <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-black text-foreground animate-glow-pulse">Akash</h2>
              <div className="text-3xl mt-6">✨😂✨</div>
            </div>
          )}

          {revealStep === "grand-reveal" && (
            <div className="text-center animate-bounce-in">
              <Balloons count={20} />
              <div className="text-5xl md:text-7xl mb-4 animate-cake-glow">🎂</div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-black mb-4">
                <span className="bg-gradient-to-r from-[hsl(330,85%,60%)] via-[hsl(45,100%,65%)] to-[hsl(200,80%,60%)] bg-clip-text text-transparent animate-gradient-shift">Happy Birthday</span>
              </h1>
              <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] font-black text-foreground animate-glow-pulse mt-4">Akash!</h2>
            </div>
          )}

          {revealStep === "final-message" && (
            <div className="text-center max-w-3xl mx-auto px-6">
              {finalLines.slice(0, finalLineIndex + 1).map((line, i) => (
                <p key={i} className={`font-display leading-relaxed mb-5 ${i === 0 ? "text-2xl md:text-4xl lg:text-5xl font-black text-yellow-400" : "text-xl md:text-3xl lg:text-4xl text-white"}`}>
                  <TypeWriter text={line} speed={65} delay={i === finalLineIndex ? 400 : 0} cursor={finalLineIndex === i} />
                </p>
              ))}
              <div className="text-3xl mt-8 animate-pulse">🤣🎉☕🎉🤣</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
