import { useState, useEffect, useMemo, CSSProperties } from "react";

interface HeartTreeProps {
    delay?: number; // Delay before growing starts (ms)
}

const TreeSparks = ({ count }: { count: number }) => {
    const sparks = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                size: 3 + Math.random() * 5,
                left: 20 + Math.random() * 60, // percentage
                bottom: 10 + Math.random() * 80, // percentage
                duration: 3 + Math.random() * 4,
                delay: Math.random() * 5,
            })),
        [count]
    );
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            {sparks.map((s) => (
                <div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                        width: s.size,
                        height: s.size,
                        left: `${s.left}%`,
                        bottom: `${s.bottom}%`,
                        // RECTIFIED: Removed the pink/soft colors, replaced with Blue/Teal
                        background: "hsl(210, 90%, 75%)",
                        boxShadow: "0 0 10px hsl(210, 90%, 75%), 0 0 20px hsl(210, 90%, 75%, 0.5)",
                        animation: `float-up ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
                        opacity: 0.7,
                    } as CSSProperties}
                />
            ))}
        </div>
    );
};

export const HeartTree = ({ delay = 1000 }: HeartTreeProps) => {
    const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);

    useEffect(() => {
        // 0: Trunk, 1: Main branches, 2: Small branches, 3: Leaves (coins/folders), 4: Glow/Bloom
        const t1 = setTimeout(() => setStage(1), delay);
        const t2 = setTimeout(() => setStage(2), delay + 1500);
        const t3 = setTimeout(() => setStage(3), delay + 3000);
        const t4 = setTimeout(() => setStage(4), delay + 4500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [delay]);

    // Tree Path Definitions (Kept the same cool tree structure)
    const trunkPath = "M 150 300 Q 145 200 150 150 Q 155 200 150 300 Z";

    const branchesStage1 = [
        { path: "M 150 180 Q 100 130 80 100", length: 140 }, // Left main
        { path: "M 150 160 Q 200 110 220 80", length: 150 }, // Right main
        { path: "M 150 150 Q 150 100 150 50", length: 110 }, // Center main
    ];

    const branchesStage2 = [
        { path: "M 115 145 Q 80 110 60 120", length: 60 }, // Off left
        { path: "M 90 110 Q 60 70 40 80", length: 70 }, // Off left higher
        { path: "M 185 130 Q 230 110 250 120", length: 70 }, // Off right
        { path: "M 205 95 Q 240 60 260 50", length: 80 }, // Off right higher
        { path: "M 150 100 Q 120 70 110 40", length: 80 }, // Off center left
        { path: "M 150 80 Q 180 50 190 30", length: 90 }, // Off center right
    ];

    const leafPositions = [
        // Center mass
        { cx: 150, cy: 50, scale: 1.2, delay: 0 },
        { cx: 130, cy: 30, scale: 0.9, delay: 0.2 },
        { cx: 170, cy: 35, scale: 0.9, delay: 0.1 },
        { cx: 150, cy: 20, scale: 0.7, delay: 0.3 },

        // Left mass
        { cx: 80, cy: 100, scale: 1.1, delay: 0.2 },
        { cx: 60, cy: 80, scale: 0.8, delay: 0.4 },
        { cx: 100, cy: 80, scale: 0.8, delay: 0.3 },
        { cx: 40, cy: 110, scale: 0.6, delay: 0.5 },

        // Right mass
        { cx: 220, cy: 80, scale: 1.1, delay: 0.1 },
        { cx: 200, cy: 60, scale: 0.8, delay: 0.3 },
        { cx: 240, cy: 70, scale: 0.9, delay: 0.2 },
        { cx: 260, cy: 90, scale: 0.7, delay: 0.4 },

        // Outer scatters
        { cx: 110, cy: 40, scale: 0.8, delay: 0.5 },
        { cx: 190, cy: 30, scale: 0.8, delay: 0.4 },
        { cx: 60, cy: 120, scale: 0.7, delay: 0.6 },
        { cx: 250, cy: 120, scale: 0.7, delay: 0.5 },
        { cx: 90, cy: 50, scale: 0.6, delay: 0.7 },
        { cx: 210, cy: 40, scale: 0.6, delay: 0.6 },
    ];

    // RECTIFIED: Definitions for the new non-romantic leaf shapes
    const coinPath = "M0,-10 A10,10 0 1,1 0,10 A10,10 0 1,1 0,-10 Z"; // Simple circle for coin
    const ruppeSymbolPath = "M0,-10 A10,10 0 1,1 0,10 A10,10 0 1,1 0,-10 Z"; // Simpler coin shape for easier formatting

    return (
        <div className="relative w-full max-w-[400px] aspect-[3/4] mx-auto overflow-hidden">
            {/* Background glow when fully bloomed */}
            <div
                className={`absolute inset-0 transition-opacity duration-2000 pointer-events-none rounded-full blur-[80px]`}
                style={{
                    // RECTIFIED: Replaced pink glow (#330) with Blue glow (#210)
                    background: "radial-gradient(circle at 50% 40%, hsl(210, 85%, 60%, 0.25), transparent 60%)",
                    opacity: stage === 4 ? 1 : 0
                }}
            />

            {stage >= 3 && <TreeSparks count={15} />}

            <svg viewBox="0 0 300 300" className="w-full h-full relative z-10 overflow-visible">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(20, 25%, 35%)" />
                        <stop offset="50%" stopColor="hsl(20, 30%, 45%)" />
                        <stop offset="100%" stopColor="hsl(20, 20%, 30%)" />
                    </linearGradient>
                </defs>

                {/* Base/Ground reflection */}
                <ellipse
                    cx="150"
                    cy="285"
                    rx="60"
                    ry="8"
                    // RECTIFIED: Blue reflection
                    fill="hsl(210, 60%, 50%)"
                    opacity={stage === 4 ? 0.3 : 0}
                    className="transition-opacity duration-2000"
                    filter="url(#glow)"
                />

                {/* Trunk */}
                <path
                    d={trunkPath}
                    fill="url(#trunkGrad)"
                    className="transition-all duration-1000 ease-out origin-bottom"
                    style={{
                        transform: `scaleY(${stage >= 1 ? 1 : 0})`,
                        opacity: stage >= 1 ? 1 : 0
                    }}
                />

                {/* Stage 1 Branches (Main) */}
                {branchesStage1.map((b, i) => (
                    <path
                        key={`main-branch-${i}`}
                        d={b.path}
                        fill="none"
                        stroke="url(#trunkGrad)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: b.length,
                            strokeDashoffset: stage >= 1 ? 0 : b.length,
                            transition: `stroke-dashoffset 1.5s ease-out ${0.5 + i * 0.2}s, opacity 0.5s ease-out`,
                            opacity: stage >= 1 ? 1 : 0
                        }}
                    />
                ))}

                {/* Stage 2 Branches (Small) */}
                {branchesStage2.map((b, i) => (
                    <path
                        key={`sub-branch-${i}`}
                        d={b.path}
                        fill="none"
                        stroke="url(#trunkGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        style={{
                            strokeDasharray: b.length,
                            strokeDashoffset: stage >= 2 ? 0 : b.length,
                            transition: `stroke-dashoffset 1.2s ease-out ${0.2 + i * 0.1}s, opacity 0.5s ease-out`,
                            opacity: stage >= 2 ? 1 : 0
                        }}
                    />
                ))}

                {/* RECTIFIED: New Leaf Sequence (Coins and Files) */}
                {leafPositions.map((leaf, i) => (
                    <g
                        key={`leaf-${i}`}
                        style={{
                            transform: `translate(${leaf.cx}px, ${leaf.cy}px) scale(${stage >= 3 ? leaf.scale : 0})`,
                            transition: `transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${leaf.delay}s`,
                            transformOrigin: "center"
                        }}
                    >
                        {i % 2 === 0 ? (
                            // Even indices are Gold Rupee Coins (₹)
                            <g>
                                <circle cx="0" cy="0" r="10" fill="hsl(45, 100%, 55%)" filter={stage === 4 ? "url(#glow)" : ""} />
                                <text x="0" y="4" fontSize="12" fontWeight="bold" fill="hsl(20, 50%, 20%)" textAnchor="middle">₹</text>
                            </g>
                        ) : (
                            // Odd indices are Blue Office Folders (📂)
                            <g transform="translate(-10, -8)">
                                <path d="M2,4 L8,4 L10,6 L18,6 L18,16 L2,16 Z" fill="hsl(210, 85%, 60%)" filter={stage === 4 ? "url(#glow)" : ""} />
                            </g>
                        )}
                    </g>
                ))}
            </svg>

            {/* Soft overlay gradient to melt it into background */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent z-20" />
        </div>
    );
};
