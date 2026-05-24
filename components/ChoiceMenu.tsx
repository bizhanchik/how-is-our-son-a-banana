"use client";

import { motion } from "framer-motion";
import type { Choice } from "@/lib/types";
import { sting, click } from "@/lib/sfx";

const TONE: Record<Choice["tone"], string> = {
  risky: "border-strawberry/70 hover:bg-strawberry/20 hover:border-strawberry",
  safe: "border-sky-400/60 hover:bg-sky-400/15 hover:border-sky-300",
  bold: "border-gold/70 hover:bg-gold/20 hover:border-gold",
};

export default function ChoiceMenu({
  choices,
  onChoose,
}: {
  choices: Choice[];
  onChoose: (c: Choice) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delayChildren: 0.05, staggerChildren: 0.08 }}
      className="flex w-full flex-col items-center gap-2 sm:gap-3"
      onMouseEnter={() => sting()}
    >
      <div className="flex w-full max-w-xl flex-col gap-2 sm:gap-3">
        {choices.map((c, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              click();
              onChoose(c);
            }}
            className={`w-full rounded-xl border-2 bg-black/80 px-5 py-3 text-left text-sm font-medium text-cream shadow-xl backdrop-blur-md transition-colors sm:py-4 sm:text-lg ${TONE[c.tone]}`}
          >
            {c.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
