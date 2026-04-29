import { useState, useEffect } from "react";
import { BIRTHDAY_NAME } from "@/config/birthday";
import { useConfetti } from "./Confetti";
import { Balloons } from "./Balloons";
import { Sparkles } from "./Sparkles";
import { PhotoGallery } from "./PhotoGallery";
import { HeartProgression } from "./HeartProgression";
import { TypeWriter } from "./TypeWriter";
import { useSoundManager } from "./SoundManager";
import { CakeCutting } from "./CakeCutting";
import { HeartTree } from "./HeartTree";

export const MainBirthday = () => {
  const [visible, setVisible] = useState(false);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [showName, setShowName] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const { fireConfetti, fireCannon } = useConfetti();
  const { playReveal, playPop, playBoom, setBgVolume } = useSoundManager();

  useEffect(() => {
    setBgVolume(0.4); 
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => {
      setHeroRevealed(true);
      playBoom();
    }, 600);
    setTimeout(() => {
      setShowName(true);
      playReveal();
    }, 1200);
    setTimeout(() => setShowEmojis(true), 1800);
    setTimeout(() => {
      fireCannon();
      playBoom();
    }, 2000);
  }, [playReveal, playBoom, setBgVolume, fireCannon]);

  const addEmoji = () => {
    playPop();
    // RECTIFIED: Office-themed emoji list for Akash
    const emojiList = ["🎉", "🥳", "☕", "⭐", "🎈", "🎊", "📂", "🎂", "✨", "🤣"];
    const newEmoji = {
      id: Date.now(),
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
      x: 20 + Math.random() * 60,
    };
    setEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id)), 2000);
  };

  return (
    <div
      className={`min-h-screen transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        // RECTIFIED: Professional Blue/Dark Theme instead of Pink
        background: "linear-gradient(135deg, hsl(220, 60%, 8%) 0%, hsl(240, 40%, 15%) 30%, hsl(210, 50%, 12%) 60%, hsl(200, 50%, 10%) 100%)",
      }}
    >
      <Balloons count={10} />
      <Sparkles count={12} />

      {emojis.map((e) => (
        <div
          key={e.id}
          className="fixed z-50 text-4xl pointer-events-none"
          style={{ left: `${e.x}%`, bottom: "20%", animation: "emoji-float 2s ease-out forwards" }}
        >
          {e.emoji}
        </div>
      ))}

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <div className={`transition-all duration-1000 ${heroRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex justify-center mb-4">
            <HeartProgression stage={4} />
          </div>
          <div className="text-7xl md:text-8xl mb-6 animate-cake-glow hover:scale-110 transition-transform cursor-pointer" onClick={addEmoji}>🎂</div>
        </div>

        <h1 className={`font-display text-4xl md:text-7xl lg:text-8xl font-black mb-4 transition-all duration-1000 delay-300 ${heroRevealed ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
          <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-blue-500 bg-clip-text text-transparent animate-gradient-shift drop-shadow-[0_4px_25px_rgba(255,255,255,0.2)]">
            <TypeWriter text="Happy Birthday" speed={90} delay={500} cursor={false} />
          </span>
        </h1>

        <h2 className={`font-display text-6xl md:text-9xl lg:text-[10rem] font-black text-foreground animate-glow-pulse transition-all duration-1000 ${showName ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <TypeWriter text="Akash!" speed={120} delay={1200} cursor={false} />
        </h2>

        <div className={`text-4xl md:text-5xl mt-8 space-x-3 transition-all duration-700 ${showEmojis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span>🎈</span><span>☕</span><span>🎊</span><span>🎁</span><span>🤣</span>
        </div>
      </section>

      <CakeCutting />
      <PhotoGallery />

      {/* RECTIFIED: The Roast Message Card */}
      <section className="relative z-20 flex justify-center px-4 pb-20">
        <div
          className="max-w-2xl w-full rounded-3xl p-8 md:p-12 backdrop-blur-lg border border-blue-500/20 shadow-2xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(220, 40%, 15%, 0.8), hsl(210, 40%, 12%, 0.8))" }}
        >
          <div className="text-5xl text-center mb-6">📂</div>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-6 text-blue-400">
            <TypeWriter text="Official Performance Review" speed={50} cursor={false} />
          </h3>
          <div className="space-y-4 text-center text-lg md:text-xl text-foreground/90 leading-relaxed">
            <p><TypeWriter text="Dear Akash," speed={45} delay={1500} cursor={false} /></p>
            <p><TypeWriter text="On this special day, we wanted to honor the man who has turned 'taking a quick break' into a professional sport. 🌟" speed={40} delay={3000} cursor={false} /></p>
            <p><TypeWriter text="May this year bring you everything you desire: shorter shifts, longer lunches, and a manager who forgets you're even there. ✨" speed={40} delay={8500} cursor={false} /></p>
            <p className="text-2xl md:text-3xl font-display font-bold text-yellow-500 pt-4">
              <TypeWriter text="Happy Birthday, Junior! 🎉" speed={60} delay={12500} cursor={true} />
            </p>
          </div>
        </div>
      </section>

      {/* RECTIFIED: Roast Wishes Section */}
      <section className="relative z-20 px-4 pb-20">
        <h3 className="font-display text-3xl md:text-5xl font-bold text-center mb-12 text-teal-400">
          Akash's Annual Goals ✨
        </h3>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { emoji: "☕", wish: "May your tea breaks last longer than your actual work hours!" },
            { emoji: "😴", wish: "Wishing you a year filled with undisturbed afternoon naps!" },
            { emoji: "🏃‍♂️", wish: "May you reach the exit door at 5:01 PM every single day!" },
            { emoji: "📁", wish: "Here's to the 'Pending' folder getting even bigger in 2026!" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 backdrop-blur-md border border-blue-500/20 hover:scale-105 transition-transform duration-300 cursor-pointer"
              style={{ background: "rgba(30, 41, 59, 0.6)" }}
              onClick={addEmoji}
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <p className="text-foreground/90 text-lg">{item.wish}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECTIFIED: Interactive Buttons */}
      <section className="relative z-20 flex flex-wrap justify-center gap-4 px-4 pb-10">
        <button
          onClick={() => { fireCannon(); addEmoji(); }}
          className="px-8 py-4 rounded-full text-lg font-bold text-white transition-all duration-300 hover:scale-110"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 0 30px rgba(37, 99, 235, 0.4)" }}
        >
          🎊 Deploy Birthday!
        </button>
        <button
          onClick={() => { fireConfetti(); addEmoji(); }}
          className="px-8 py-4 rounded-full text-lg font-bold text-white transition-all duration-300 hover:scale-110"
          style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)" }}
        >
          🎈 Pop The Junior!
        </button>
        <button
          onClick={() => { for (let i = 0; i < 5; i++) setTimeout(addEmoji, i * 200); }}
          className="px-8 py-4 rounded-full text-lg font-bold text-white transition-all duration-300 hover:scale-110"
          style={{ background: "linear-gradient(135deg, #06b6d4, #0d9488)", boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" }}
        >
          ☕ Send Tea Break!
        </button>
      </section>

      <section className="relative z-20 flex justify-center px-4 pb-20 pt-10">
        <div className="w-full flex justify-center">
          <HeartTree delay={500} />
        </div>
      </section>

      <footer className="relative z-20 text-center py-12 pb-24 text-muted-foreground">
        <p className="text-xl md:text-2xl">
          Built for <span className="font-display font-bold text-blue-400">Akash</span> — The Office Legend
        </p>
      </footer>
    </div>
  );
};
