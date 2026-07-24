"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TagDef } from "@/lib/types";

/**
 * Tag-reactive background: soft color wash + diagonally tiled category icons.
 * Cross-fades when the active tag changes.
 */
export default function BackgroundPattern({ tag }: { tag: TagDef }) {
  const icons = tag.icons.length ? tag.icons : ["·"];
  // 4×4 cell wallpaper inside a tilted pattern tile
  const cols = 4;
  const rows = 4;
  const cell = 56;
  const tile = cell * cols;

  const glyphs = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // brick offset every other row → more diagonal rhythm
    const offsetX = row % 2 === 1 ? cell * 0.5 : 0;
    const x = col * cell + offsetX + cell * 0.28;
    const y = row * cell + cell * 0.62;
    const icon = icons[i % icons.length];
    const size = 15 + ((i * 5) % 11);
    const opacity = 0.1 + ((i * 3) % 5) * 0.018;
    const rot = ((i % 5) - 2) * 4; // slight per-glyph tilt variety
    return { i, x, y, icon, size, opacity, rot };
  });

  return (
    <>
      <div
        className="bg-tint"
        style={{
          background: `
            radial-gradient(90% 70% at 12% 8%, ${tag.coverFrom}aa 0%, transparent 55%),
            radial-gradient(80% 60% at 88% 92%, ${tag.coverTo}88 0%, transparent 50%),
            linear-gradient(155deg, ${tag.coverFrom}66 0%, transparent 62%)
          `,
        }}
      />

      <AnimatePresence mode="sync">
        <motion.div
          key={tag.id}
          className="bg-pattern"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          aria-hidden
        >
          <svg className="bg-pattern-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`pat-${tag.id}`}
                width={tile}
                height={tile}
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(-18)"
              >
                {glyphs.map((g) => (
                  <text
                    key={g.i}
                    x={g.x}
                    y={g.y}
                    fill={tag.accent}
                    opacity={g.opacity}
                    fontSize={g.size}
                    fontFamily="'Space Grotesk', 'Noto Sans SC', sans-serif"
                    fontWeight={500}
                    transform={`rotate(${g.rot} ${g.x} ${g.y})`}
                    style={{ userSelect: "none" }}
                  >
                    {g.icon}
                  </text>
                ))}
              </pattern>
              {/* soft vignette so icons don't fight the cards */}
              <radialGradient id={`fade-${tag.id}`} cx="50%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="70%" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.55" />
              </radialGradient>
              <mask id={`mask-${tag.id}`}>
                <rect width="100%" height="100%" fill={`url(#fade-${tag.id})`} />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#pat-${tag.id})`}
              mask={`url(#mask-${tag.id})`}
            />
          </svg>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
