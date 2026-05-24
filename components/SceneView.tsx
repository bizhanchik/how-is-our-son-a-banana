"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Scene, Choice } from "@/lib/types";
import DialogueBox, { type DialogueHandle } from "./DialogueBox";
import ChoiceMenu from "./ChoiceMenu";
import Voiceover from "./Voiceover";
import { dramaSwell } from "@/lib/sfx";

const POS: Record<string, string> = {
  left: "left-[2%] sm:left-[8%]",
  center: "left-1/2 -translate-x-1/2",
  right: "right-[2%] sm:right-[8%]",
};

interface Props {
  scene: Scene;
  lineIndex: number;
  onAdvance: () => void;
  onChoose: (c: Choice) => void;
}

export default function SceneView({ scene, lineIndex, onAdvance, onChoose }: Props) {
  const [lineComplete, setLineComplete] = useState(false);
  const boxRef = useRef<DialogueHandle>(null);

  const line = scene.dialogue[lineIndex];
  const isLastLine = lineIndex >= scene.dialogue.length - 1;
  const hasChoices = !!scene.choices?.length;
  const showChoices = isLastLine && hasChoices && lineComplete;
  const showAdvance = lineComplete && !showChoices;

  // reset completion state per line
  useEffect(() => {
    setLineComplete(false);
  }, [lineIndex, scene.id]);

  // dramatic swell when entering a reveal scene
  const isReveal = scene.cinematic === "reveal";
  useEffect(() => {
    if (isReveal) dramaSwell();
  }, [isReveal, scene.id]);

  const handleStageClick = useCallback(() => {
    if (showChoices) return;
    const box = boxRef.current;
    if (box && !box.isDone()) {
      box.complete();
      setLineComplete(true);
      return;
    }
    onAdvance();
  }, [showChoices, onAdvance]);

  const onComplete = useCallback(() => setLineComplete(true), []);

  // shake on the iconic banana reveal line
  const shaking = useMemo(
    () => scene.endingKind === "exposed" && line?.text.includes("banana"),
    [scene.endingKind, line],
  );

  return (
    <motion.div
      className="vignette relative h-full w-full overflow-hidden bg-black"
      animate={shaking ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* background crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={scene.background}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={scene.background}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* sprites */}
      <AnimatePresence>
        {scene.sprites?.map((s) => (
          <motion.div
            key={`${scene.id}-${s.src}`}
            initial={{ opacity: 0, x: s.position === "left" ? -60 : s.position === "right" ? 60 : 0, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute bottom-0 z-10 h-[72%] w-[55%] sm:h-[85%] sm:w-[40%] ${POS[s.position ?? "center"]}`}
          >
            <Image
              src={s.src}
              alt={s.name}
              fill
              priority
              sizes="(max-width: 640px) 55vw, 40vw"
              className="object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* letterbox */}
      {scene.letterbox && (
        <>
          <div className="letterbox-bar top" />
          <div className="letterbox-bar bottom" />
        </>
      )}

      {/* click catcher (below choices, dialogue is pointer-events-none) */}
      <button
        aria-label="Advance"
        onClick={handleStageClick}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer"
      />

      {scene.voiceover && <Voiceover text={scene.voiceover} />}

      {line && (
        <DialogueBox
          ref={boxRef}
          key={`${scene.id}-${lineIndex}`}
          speaker={line.speaker}
          text={line.text}
          onComplete={onComplete}
          showAdvance={showAdvance}
        />
      )}

      {showChoices && scene.choices && (
        <ChoiceMenu choices={scene.choices} onChoose={onChoose} />
      )}
    </motion.div>
  );
}
