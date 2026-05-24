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
      className="absolute inset-x-0 bottom-0 z-40 flex flex-col items-center gap-3 px-4 pb-8 sm:pb-12"
      onMouseEnter={() => sting()}
    >
      <div className="flex w-full max-w-xl flex-col gap-3">
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
            className={`w-full rounded-xl border-2 bg-black/75 px-5 py-4 text-left text-base font-medium text-cream shadow-xl backdrop-blur-md transition-colors sm:text-lg ${TONE[c.tone]}`}
          >
            {c.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
