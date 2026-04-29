import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    emoji: string;
}

// SWAPPED: Romantic emojis replaced with "Junior Office Roast" emojis
const EMOJIS = ['✨', '🎈', '🎉', '☕', '😴', '🏃‍♂️', '📂', '🤣'];
// SWAPPED: Replaced pink/soft colors with more vibrant, professional colors
const COLORS = ['#FFD700', '#3B82F6', '#7FFFD4', '#FF4500', '#ADFF2F', '#00BFFF'];

export const CelebrationOverlay = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newParticle = {
                id: Date.now(),
                x: Math.random() * 100,
                y: 100,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            };
            // Keep a decent amount of particles floating for that "messy office" feel
            setParticles(prev => [...prev.slice(-25), newParticle]);
        }, 800); // Made it slightly faster so it feels more chaotic/funny

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ y: "110%", x: p.x + "%", opacity: 0, scale: 0.5 }}
                        animate={{
                            y: "-10%",
                            x: (p.x + (Math.random() * 30 - 15)) + "%", // Added more horizontal "swaying"
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1.3, 1, 0.7],
                            rotate: [0, 180, 360, 720] // More rotation for extra chaos
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 7, ease: "easeOut" }}
                        className="absolute text-3xl drop-shadow-2xl"
                        style={{ color: p.color }}
                    >
                        {p.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
