import { useState, useEffect } from "react";
import { useSoundManager } from "./SoundManager";

interface FakeChatSceneProps {
  onComplete: () => void;
}

export const FakeChatScene = ({ onComplete }: FakeChatSceneProps) => {
  const [phase, setPhase] = useState<
    "appear" | "typing" | "typed" | "cursor-move" | "cursor-hover" | "deleting" | "deleted" | "retype" | "message" | "fadeout"
  >("appear");
  const [typedText, setTypedText] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [retypeText, setRetypeText] = useState("");
  const { playType, playWhoosh, playReveal } = useSoundManager();

  // THE ROAST TEXTS
  const fullText = "Happy Birthday, Akash!";
  const retypeFullText = "But we know you'd ignore a simple message...";

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Chat appears (0-1s)
    timers.push(setTimeout(() => {
      setPhase("typing");
      playWhoosh();
    }, 1000));

    // Phase 2: Type "Happy Birthday, Akash!" (1-3s)
    for (let i = 0; i < fullText.length; i++) {
      timers.push(setTimeout(() => {
        setTypedText(fullText.slice(0, i + 1));
        playType();
      }, 1000 + i * 120));
    }

    const typeEnd = 1000 + fullText.length * 120;

    // Phase 3: Cursor moves toward send (3-5s)
    timers.push(setTimeout(() => {
      setPhase("cursor-move");
      setShowCursor(true);
      setCursorPos({ x: 50, y: 75 });
      playWhoosh();
    }, typeEnd + 300));
    timers.push(setTimeout(() => setCursorPos({ x: 80, y: 68 }), typeEnd + 800));
    timers.push(setTimeout(() => setCursorPos({ x: 90, y: 63 }), typeEnd + 1400));

    // Phase 4: Hover near send (5-6.5s)
    timers.push(setTimeout(() => {
      setPhase("cursor-hover");
      setCursorPos({ x: 93, y: 61 });
    }, typeEnd + 2000));

    // Phase 5: Cursor pulls away, start deleting (6.5-8.5s)
    timers.push(setTimeout(() => {
      setShowCursor(false);
      setPhase("deleting");
    }, typeEnd + 3500));

    for (let i = fullText.length; i >= 0; i--) {
      timers.push(setTimeout(() => {
        setTypedText(fullText.slice(0, i));
        playType();
      }, typeEnd + 3500 + (fullText.length - i) * 80));
    }

    const deleteEnd = typeEnd + 3500 + fullText.length * 80;

    // Phase 6: Pause after deletion
    timers.push(setTimeout(() => setPhase("deleted"), deleteEnd + 200));

    // Phase 7: Retype roast text
    timers.push(setTimeout(() => setPhase("retype"), deleteEnd + 1000));
    for (let i = 0; i < retypeFullText.length; i++) {
      timers.push(setTimeout(() => {
        setRetypeText(retypeFullText.slice(0, i + 1));
        playType();
      }, deleteEnd + 1000 + i * 70));
    }

    const retypeEnd = deleteEnd + 1000 + retypeFullText.length * 70;

    // Phase 8: Show "so we built this to roast you"
    timers.push(setTimeout(() => {
      setPhase("message");
      playReveal();
    }, retypeEnd + 800));

    // Phase 9: Fade out
    timers.push(setTimeout(() => {
      setFadeOut(true);
      setPhase("fadeout");
      playWhoosh();
    }, retypeEnd + 4000));

    timers.push(setTimeout(() => onComplete(), retypeEnd + 5500));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, playType, playWhoosh, playReveal]);

  const isTypingPhase = phase === "typing" || phase === "typed";
  const showRetypeInInput = phase === "retype" || phase === "message" || phase === "fadeout";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
      <div className="relative w-[90vw] max-w-md animate-slide-up-fade" style={{ animationDuration: "0.6s" }}>
        {/* Phone frame */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/30" style={{ background: "hsl(220, 20%, 15%)" }}>
          
          {/* Chat header */}
          <div className="px-4 py-3 flex items-center gap-3 border-b border-border/20" style={{ background: "hsl(220, 20%, 10%)" }}>
            <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-xl">☕</div>
            <div>
              <p className="text-foreground text-sm font-semibold">Akash (The Ghost Junior)</p>
              <p className="text-xs" style={{ color: "hsl(30, 90%, 60%)" }}>away (probably on break)</p>
            </div>
            <div className="ml-auto flex gap-2 text-muted-foreground/40">
              <span>📞</span><span>📹</span>
            </div>
          </div>

          {/* Chat body */}
          <div className="px-4 py-6 min-h-[220px] flex flex-col justify-end gap-2">
            <div className="self-start max-w-[70%] px-3 py-2 rounded-xl rounded-bl-sm text-sm text-foreground/80" style={{ background: "hsl(0, 50%, 30%)" }}>
              Akash! 🚨
            </div>
            <div className="self-start max-w-[70%] px-3 py-2 rounded-xl rounded-bl-sm text-sm text-foreground/80" style={{ background: "hsl(0, 50%, 30%)" }}>
              Where are you? The pending files are piling up!
            </div>

            {/* Typing indicator */}
            {isTypingPhase && typedText.length === 0 && (
              <div className="self-end flex gap-1 px-4 py-3 rounded-xl rounded-br-sm" style={{ background: "hsl(220, 30%, 25%)" }}>
                <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="px-3 py-3 flex items-center gap-2 border-t border-border/20" style={{ background: "hsl(220, 20%, 8%)" }}>
            <div className="flex-1 rounded-full px-4 py-2.5 text-sm text-foreground min-h-[40px] flex items-center" style={{ background: "hsl(220, 30%, 15%)" }}>
              {showRetypeInInput && retypeText ? (
                <span className="italic" style={{ color: "hsl(220, 10%, 75%)" }}>
                  {retypeText}
                  {phase === "retype" && <span className="inline-block w-[2px] h-4 ml-0.5 bg-primary animate-blink align-middle" />}
                </span>
              ) : typedText ? (
                <span>
                  {typedText}
                  <span className="inline-block w-[2px] h-4 ml-0.5 bg-primary animate-blink align-middle" />
                </span>
              ) : (
                <span className="text-muted-foreground/50 flex items-center">
                  Type a message...
                  {(phase === "appear" || phase === "deleted") && (
                    <span className="inline-block w-[2px] h-4 ml-0.5 bg-primary animate-blink align-middle" />
                  )}
                </span>
              )}
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground transition-all duration-300"
              style={{
                background: phase === "cursor-hover" ? "hsl(220, 85%, 55%)" : "hsl(220, 85%, 45%)",
                transform: phase === "cursor-hover" ? "scale(1.15)" : "scale(1)",
                boxShadow: phase === "cursor-hover" ? "0 0 20px hsl(220, 85%, 55%, 0.5)" : "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Animated fake cursor */}
        {showCursor && (
          <div
            className="absolute w-5 h-5 pointer-events-none z-50 transition-all ease-in-out"
            style={{
              left: `${cursorPos.x}%`,
              top: `${cursorPos.y}%`,
              transitionDuration: "700ms",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
              <path d="M5 3l14 8-6 2-4 6z" />
            </svg>
          </div>
        )}

        {/* Emotional message -> Roast message */}
        {(phase === "message" || phase === "fadeout") && (
          <div className="text-center mt-8 animate-slide-up-fade">
            <p className="text-lg md:text-xl font-display text-foreground/90 italic mb-2" style={{ textShadow: "0 0 30px hsl(0, 85%, 60%, 0.3)" }}>
              so we decided to publicly roast you instead...
            </p>
            <p className="text-sm text-muted-foreground/60 animate-pulse">😂☕</p>
          </div>
        )}
      </div>
    </div>
  );
};
