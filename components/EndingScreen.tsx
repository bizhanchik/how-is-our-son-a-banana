"use client";

import { motion } from "framer-motion";
import { click } from "@/lib/sfx";

interface Props {
  kind: "perfect" | "exposed";
  suspicion: number;
  onReplay: () => void;
}

export default function EndingScreen({ kind, suspicion, onReplay }: Props) {
  const perfect = kind === "perfect";
  const title = perfect ? "The Perfect Crime" : "Exposed";
  const card = perfect ? "She got away with it." : "Strawberrina lost everything.";
  const verdict = perfect
    ? suspicion <= 0
      ? "Flawless. You covered every track. The seeds never lie — but you made them."
      : "Cutting it close, but the baby came out red. Luck favors the guilty."
    : "Too greedy. You left the evidence, and the evidence was yellow.";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 px-6 text-center backdrop-blur-sm"
    >
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        className="text-6xl sm:text-7xl"
      >
        {perfect ? "🍓" : "🍌"}
      </motion.span>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="label-track mt-6 text-xs text-gold sm:text-sm"
      >
        Ending {perfect ? "A" : "B"}
      </motion.p>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`font-display text-5xl font-black sm:text-7xl ${perfect ? "text-strawberry" : "text-banana"}`}
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 font-display text-xl italic text-cream sm:text-2xl"
      >
        “{card}”
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-8 rounded-2xl border border-gold/20 bg-black/50 px-6 py-4"
      >
        <p className="text-sm text-cream/70">
          Final suspicion: <span className="font-bold text-gold">{suspicion}</span>
        </p>
        <p className="mt-1 max-w-md text-sm text-cream/60">{verdict}</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          click();
          onReplay();
        }}
        className="mt-10 rounded-full bg-strawberry px-10 py-3.5 text-lg font-bold text-white shadow-[0_8px_30px_rgba(230,57,80,0.5)] transition-colors hover:bg-crimson"
      >
        ↺ Play Again
      </motion.button>
    </motion.div>
  );
}
