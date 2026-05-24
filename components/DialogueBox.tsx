"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Speaker } from "@/lib/types";
import { tick } from "@/lib/sfx";

const SPEAKER_COLOR: Record<Speaker, string> = {
  Strawberrina: "bg-strawberry text-white",
  Bananito: "bg-banana text-wine",
  Strawberto: "bg-crimson text-white",
  Doctor: "bg-cream text-wine",
  Narrator: "bg-transparent text-gold border border-gold/50",
};

export interface DialogueHandle {
  isDone: () => boolean;
  complete: () => void;
}

interface Props {
  speaker: Speaker;
  text: string;
  onComplete: () => void;
  showAdvance: boolean;
}

const DialogueBox = forwardRef<DialogueHandle, Props>(function DialogueBox(
  { speaker, text, onComplete, showAdvance },
  ref,
) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  const setBoth = (n: number) => {
    countRef.current = n;
    setCount(n);
  };

  // reset on new line
  useEffect(() => {
    setBoth(0);
  }, [text]);

  // typewriter
  useEffect(() => {
    if (count >= text.length) return;
    const id = setTimeout(() => {
      setBoth(Math.min(count + 1, text.length));
      if (text[count] && text[count] !== " ") tick();
    }, 28);
    return () => clearTimeout(id);
  }, [count, text]);

  // notify parent once fully revealed
  const done = count >= text.length;
  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

  // synchronous controls for the click handler (no stale state)
  useImperativeHandle(
    ref,
    () => ({
      isDone: () => countRef.current >= text.length,
      complete: () => setBoth(text.length),
    }),
    [text],
  );

  const isNarrator = speaker === "Narrator";

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none w-full"
    >
      <div className="mx-auto max-w-3xl">
        <span
          className={`label-track inline-block rounded-md px-3 py-1 text-[11px] font-bold sm:text-xs ${SPEAKER_COLOR[speaker]}`}
        >
          {isNarrator ? "✦ Narrator" : speaker}
        </span>
        <div className="mt-2 rounded-2xl border border-gold/20 bg-black/70 p-5 shadow-2xl backdrop-blur-md sm:p-7">
          <p
            className={`min-h-[3.5em] text-lg leading-relaxed sm:min-h-[2.5em] sm:text-2xl ${
              isNarrator ? "font-display italic text-gold" : "text-cream"
            }`}
          >
            {text.slice(0, count)}
          </p>
          {showAdvance && (
            <div className="mt-1 flex justify-end">
              <span className="pulse-soft text-sm text-gold sm:text-base">▼ click</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default DialogueBox;
