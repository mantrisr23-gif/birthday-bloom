import { useState, useEffect, useRef } from "react";
import { PHOTO_ASSETS } from "@/config/birthday";

// Fallbacks are set to your generated funny images
const photo1Default = "/funny1.jpg";
const photo2Default = "/funny2.jpg";
const photo3Default = "/funny3.jpg";

const photos = [
  { 
    src: PHOTO_ASSETS.photo1 || photo1Default, 
    fallback: photo1Default, 
    caption: "Evidence of another unauthorized tea break ☕", 
    key: "p1" 
  },
  { 
    src: PHOTO_ASSETS.photo2 || photo2Default, 
    fallback: photo2Default, 
    caption: "The exact moment work was 'pending' 📂", 
    key: "p2" 
  },
  { 
    src: PHOTO_ASSETS.photo3 || photo3Default, 
    fallback: photo3Default, 
    caption: "Rare sighting of Akash actually awake 😴", 
    key: "p3" 
  },
].filter(p => p.src !== null);

export const PhotoGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (lightbox !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [lightbox]);

  if (photos.length === 0) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative z-20 px-4 py-16 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        <h3 className="font-display text-3xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-teal-300 to-blue-500 bg-clip-text text-transparent animate-gradient-shift">
          The Junior Files 📸
        </h3>

        {/* Featured photo */}
        <div className="max-w-2xl mx-auto mb-8">
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20 cursor-pointer group"
            onClick={() => setLightbox(activeIndex)}
            style={{
              boxShadow: "0 0 60px rgba(59, 130, 246, 0.2), 0 0 120px rgba(13, 148, 136, 0.1)",
            }}
          >
            {photos.map((photo, i) => (
              <div
                key={i}
                className="w-full transition-all duration-1000"
                style={{
                  opacity: i === activeIndex ? 1 : 0,
                  position: i === activeIndex ? "relative" : "absolute",
                  top: 0, left: 0,
                  transform: i === activeIndex ? "scale(1)" : "scale(1.08)",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = photo.fallback;
                  }}
                  className="w-full h-[300px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }}
                />
                <p className="absolute bottom-4 left-0 right-0 text-center font-display text-lg md:text-xl text-foreground/90 italic"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
                >
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-blue-500 scale-130" : "bg-gray-600"}`}
            />
          ))}
        </div>

        {/* Thumbnails */}
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${i === activeIndex ? "border-blue-500 shadow-lg" : "border-transparent"}`}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = photo.fallback;
                }}
                className="w-full h-24 md:h-32 object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-[90vw] animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[lightbox].src}
              alt={photos[lightbox].caption}
              onError={(e) => {
                (e.target as HTMLImageElement).src = photos[lightbox].fallback;
              }}
              className="w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-center mt-4 font-display text-xl text-white italic">
              {photos[lightbox].caption}
            </p>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
