"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { click } from "@/lib/sfx";
import { recordEnding, getEndingsFound, TOTAL_ENDINGS } from "@/lib/progress";

type Kind = "perfect" | "exposed" | "closecall";

const ENDINGS: Record<Kind, { emoji: string; label: string; title: string; color: string; card: string; verdict: string }> = {
  perfect: {
    emoji: "🍓",
    label: "Ending A",
    title: "The Perfect Crime",
    color: "text-strawberry",
    card: "She got away with it.",
    verdict: "Flawless. You covered every track. The seeds never lie — but you made them.",
  },
  closecall: {
    emoji: "🍓",
    label: "Ending C",
    title: "Close Call",
    color: "text-gold",
    card: "She got away with it. For now.",
    verdict: "Cutting it fine. The baby came out red — but he's counting every late night. Tidy up next time.",
  },
  exposed: {
    emoji: "🍌",
    label: "Ending B",
    title: "Exposed",
    color: "text-banana",
    card: "Strawberrina lost everything.",
    verdict: "Too greedy. You left the evidence, and the evidence was yellow.",
  },
};

export default function EndingScreen({
  kind,
  suspicion,
  onReplay,
}: {
  kind: Kind;
  suspicion: number;
  onReplay: () => void;
}) {
  const e = ENDINGS[kind];
  const [found, setFound] = useState(0);

  useEffect(() => {
    recordEnding(kind);
    setFound(getEndingsFound().length);
  }, [kind]);

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
        {e.emoji}
      </motion.span>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="label-track mt-6 text-xs text-gold sm:text-sm"
      >
        {e.label}
      </motion.p>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className={`font-display text-5xl font-black sm:text-7xl ${e.color}`}
      >
        {e.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 font-display text-xl italic text-cream sm:text-2xl"
      >
        “{e.card}”
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
        <p className="mt-1 max-w-md text-sm text-cream/60">{e.verdict}</p>
        <p className="mt-3 border-t border-white/10 pt-3 text-xs text-cream/70">
          Endings discovered: <span className="font-bold text-gold">{found}</span> / {TOTAL_ENDINGS}
          {found < TOTAL_ENDINGS && " — play again to find the rest"}
        </p>
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
