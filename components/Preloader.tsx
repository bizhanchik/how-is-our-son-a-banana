"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { collectAssets } from "@/lib/assets";

const FLAVOR = [
  "Ripening the strawberries…",
  "Briefing Bananito…",
  "Ironing Strawberto's polo…",
  "Hiding the hotel receipts…",
  "Cueing the telenovela strings…",
  "Warming up the delivery room…",
];

// fetch one asset into the browser cache, never throwing
async function warm(url: string) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    await fetch(url, { cache: "force-cache", signal: ctrl.signal }).then((r) => r.blob());
    clearTimeout(t);
  } catch {
    /* missing/slow asset — count it anyway */
  }
}

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [flavor, setFlavor] = useState(FLAVOR[0]);
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    };

    const urls = collectAssets();
    const total = urls.length || 1;
    let done = 0;
    let i = 0;
    const CONC = 6;

    const worker = async () => {
      while (i < urls.length) {
        const url = urls[i++];
        await warm(url);
        done++;
        setPct(Math.round((done / total) * 100));
      }
    };

    Promise.all(Array.from({ length: CONC }, worker)).then(() => {
      setPct(100);
      setTimeout(finish, 250); // let the bar reach 100 visibly
    });

    // hard safety cap so the player is never trapped
    const cap = setTimeout(finish, 60000);
    const flav = setInterval(() => setFlavor(FLAVOR[Math.floor(Math.random() * FLAVOR.length)]), 1400);
    return () => {
      clearTimeout(cap);
      clearInterval(flav);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="vignette absolute inset-0 z-50 flex flex-col items-center justify-center px-8 text-center"
      style={{ background: "radial-gradient(120% 90% at 50% 20%, #4a0d18 0%, #2a0a0e 45%, #120406 100%)" }}
    >
      <motion.span
        animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl"
      >
        🍓
      </motion.span>
      <p className="label-track mt-6 text-xs text-gold sm:text-sm">Setting the scene</p>
      <p className="mt-2 h-5 font-display text-base italic text-strawberry/90 sm:text-lg">{flavor}</p>

      <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-white/10 sm:w-80">
        <motion.div
          className="h-full rounded-full bg-gold"
          animate={{ width: `${pct}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
      <p className="mt-3 text-xs text-cream/50">{pct}%</p>
    </motion.div>
  );
}
