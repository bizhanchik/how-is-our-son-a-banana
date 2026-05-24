"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { click, sting } from "@/lib/sfx";

const MESSAGES = [
  "last night was unforgettable 🔥",
  "my office. same time tomorrow?",
  "you left your earring here 😏",
  "don't tell Strawberto 🤫",
  "miss your seeds already 🍓",
];

const DURATION = 7000; // ms

/** Map deleted-count → suspicion delta. Clean sweep is best. */
function deltaFor(deleted: number): number {
  return [3, 2, 1, 0, -2, -3][deleted] ?? 0;
}

export default function DeleteEvidenceGame({ onFinish }: { onFinish: (delta: number) => void }) {
  const [deleted, setDeleted] = useState<boolean[]>(() => MESSAGES.map(() => false));
  const [remaining, setRemaining] = useState(DURATION);
  const [done, setDone] = useState(false);
  const deletedRef = useRef(deleted);
  const finishedRef = useRef(false);
  deletedRef.current = deleted;

  const count = deleted.filter(Boolean).length;

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const n = deletedRef.current.filter(Boolean).length;
    setDone(true);
    sting();
    // brief result beat, then proceed
    setTimeout(() => onFinish(deltaFor(n)), 1200);
  };

  // countdown
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const left = Math.max(0, DURATION - (Date.now() - start));
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        finish();
      }
    }, 50);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remove = (i: number) => {
    if (done || deleted[i]) return;
    click();
    const next = deleted.map((d, j) => (j === i ? true : d));
    setDeleted(next);
    if (next.every(Boolean)) finish(); // clean sweep → finish early
  };

  const pct = (remaining / DURATION) * 100;
  const danger = remaining < 2500;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm"
      >
        <p className="label-track mb-1 text-center text-xs text-gold">Cover your tracks</p>
        <h3 className="mb-3 text-center font-display text-2xl font-bold text-cream sm:text-3xl">
          {done ? "Phone away!" : "Delete the texts before he walks in!"}
        </h3>

        {/* timer bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className={`h-full rounded-full transition-[width] duration-75 ${danger ? "bg-strawberry" : "bg-gold"}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* phone */}
        <div className="rounded-[2rem] border-4 border-white/20 bg-[#0e0e12] p-3 shadow-2xl">
          <div className="mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
            <span className="text-xl">🍌</span>
            <span className="text-sm font-semibold text-cream">Bananito</span>
            <span className="ml-auto text-[10px] text-cream/40">now</span>
          </div>
          <div className="flex min-h-[230px] flex-col gap-2">
            <AnimatePresence>
              {MESSAGES.map((m, i) =>
                deleted[i] ? null : (
                  <motion.button
                    key={i}
                    onClick={() => remove(i)}
                    exit={{ opacity: 0, x: 60, height: 0, marginTop: 0 }}
                    whileTap={{ scale: 0.94 }}
                    className="group flex items-center gap-2 self-start rounded-2xl rounded-bl-sm bg-[#2a2a33] px-3 py-2 text-left text-sm text-cream"
                  >
                    <span>{m}</span>
                    <span className="text-base opacity-50 transition-opacity group-hover:opacity-100">🗑️</span>
                  </motion.button>
                ),
              )}
            </AnimatePresence>
            {count === MESSAGES.length && (
              <p className="mt-auto text-center text-sm text-gold">✦ Spotless.</p>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-cream/50">
          {done ? "..." : `Tap each message to delete it (${count}/${MESSAGES.length})`}
        </p>
      </motion.div>
    </motion.div>
  );
}
