"use client";

import { motion } from "framer-motion";

export default function Voiceover({ text }: { text: string }) {
  return (
    <motion.div
      key={text}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-6 sm:pt-10"
    >
      <p
        className="max-w-2xl text-center font-display text-base italic leading-snug sm:text-xl"
        style={{ color: "#e8c98b", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
      >
        {text}
      </p>
    </motion.div>
  );
}
