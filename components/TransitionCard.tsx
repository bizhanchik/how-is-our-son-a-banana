"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  time?: string;
  place?: string;
  bg?: string;
  onDismiss: () => void;
}

export default function TransitionCard({ time, place, bg, onDismiss }: Props) {
  // auto-dismiss after a beat
  useEffect(() => {
    const id = setTimeout(onDismiss, 1900);
    return () => clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.button
      type="button"
      aria-label="Continue"
      onClick={onDismiss}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-50 flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-wine"
    >
      {bg && (
        <Image src={bg} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      {/* darkening + vignette so text always reads */}
      <div className="absolute inset-0 bg-black/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      <motion.div
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="relative z-10 px-6 text-center"
      >
        {time && (
          <p className="label-track text-xs text-gold sm:text-sm" style={{ textShadow: "0 2px 10px #000" }}>
            {time}
          </p>
        )}
        {place && (
          <h2
            className="mt-3 font-display text-4xl font-black text-cream sm:text-6xl"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}
          >
            {place}
          </h2>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-5 h-px w-24 bg-gold/70"
        />
      </motion.div>
    </motion.button>
  );
}
