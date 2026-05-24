"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { click } from "@/lib/sfx";
import { getEndingsFound, TOTAL_ENDINGS } from "@/lib/progress";
import HowToPlay from "./HowToPlay";

export default function TitleScreen({ onStart }: { onStart: () => void }) {
  const [showHelp, setShowHelp] = useState(false);
  const [found, setFound] = useState(0);
  useEffect(() => setFound(getEndingsFound().length), []);

  return (
    <div className="vignette relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* animated gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 10%, #4a0d18 0%, #2a0a0e 45%, #120406 100%)",
        }}
      />
      {/* floating fruit */}
      {["🍓", "🍌", "🍓", "🍌", "🍓"].map((f, i) => (
        <motion.span
          key={i}
          className="absolute select-none text-5xl opacity-20 sm:text-7xl"
          style={{ left: `${10 + i * 19}%`, top: `${15 + (i % 3) * 22}%` }}
          animate={{ y: [0, -22, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          {f}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="label-track mb-4 text-xs text-gold/80 sm:text-sm">
          A Fruit-Drama Visual Novel
        </span>
        <h1 className="font-display text-5xl font-black leading-[0.95] text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] sm:text-7xl md:text-8xl">
          How Is Our Son
          <br />
          <span className="text-banana">A Banana?</span>
        </h1>
        <p className="mt-6 max-w-md font-display text-base italic text-strawberry/90 sm:text-lg">
          She has a husband at home and a boss at the office. She has nine months
          to get away with it.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              click();
              onStart();
            }}
            className="rounded-full bg-strawberry px-12 py-4 text-lg font-bold text-white shadow-[0_8px_30px_rgba(230,57,80,0.5)] transition-colors hover:bg-crimson sm:text-xl"
          >
            Begin the Drama ▸
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              click();
              setShowHelp(true);
            }}
            className="rounded-full border border-gold/40 px-8 py-4 text-base font-semibold text-cream/90 transition-colors hover:bg-white/5"
          >
            How to Play
          </motion.button>
        </div>

        {found > 0 && (
          <p className="mt-5 text-xs text-gold/80">
            Endings discovered: {found} / {TOTAL_ENDINGS}
          </p>
        )}
        <p className="mt-3 max-w-sm text-xs text-cream/40">
          A parody of the AI Fruit Drama / Fruit Love Island trend. Your choices
          decide the ending. Nobody is watching. (Everyone is watching.)
        </p>
      </motion.div>

      <AnimatePresence>
        {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      </AnimatePresence>
    </div>
  );
}
