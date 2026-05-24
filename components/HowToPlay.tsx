"use client";

import { motion } from "framer-motion";
import { click } from "@/lib/sfx";

const ROWS = [
  { icon: "🍓", title: "You are Strawberrina", body: "A married strawberry with a boring husband at home and a banana boss at the office. One bad decision and nine long months." },
  { icon: "🎯", title: "The goal", body: "Have the affair — and get away with it. Reach the delivery room without getting caught." },
  { icon: "🕵️", title: "The twist: a hidden suspicion meter", body: "Every choice you make secretly raises or lowers how suspicious your husband gets. You can't see the number. You'll only learn the damage when the baby is born." },
  { icon: "👆", title: "How to play", body: "Click to advance dialogue (click again to skip the typing). Pick choices at decision points. One scene is a timed mini-game — delete the evidence fast." },
  { icon: "🍌", title: "Three endings", body: "Play it cool and the baby's a strawberry. Get greedy and... well. Find all three." },
];

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gold/25 bg-wine-2 p-6 shadow-2xl sm:p-8"
      >
        <h2 className="font-display text-3xl font-black text-cream sm:text-4xl">How to Play</h2>
        <p className="mt-1 text-sm italic text-strawberry/90">A fruit-drama game of deception.</p>

        <div className="mt-5 flex flex-col gap-4">
          {ROWS.map((r) => (
            <div key={r.title} className="flex gap-3">
              <span className="text-2xl leading-none">{r.icon}</span>
              <div>
                <p className="font-semibold text-cream">{r.title}</p>
                <p className="text-sm leading-snug text-cream/70">{r.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            click();
            onClose();
          }}
          className="mt-6 w-full rounded-full bg-strawberry py-3 text-base font-bold text-white transition-colors hover:bg-crimson"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}
