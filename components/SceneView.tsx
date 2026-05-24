"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Scene, Choice } from "@/lib/types";
import DialogueBox, { type DialogueHandle } from "./DialogueBox";
import ChoiceMenu from "./ChoiceMenu";
import TransitionCard from "./TransitionCard";
import DeleteEvidenceGame from "./DeleteEvidenceGame";
import { sceneLines } from "@/lib/lines";
import { dramaSwell } from "@/lib/sfx";
import { playClip, clipPath, stopVoice } from "@/lib/audio";

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
  const [showCard, setShowCard] = useState(false);
  const boxRef = useRef<DialogueHandle>(null);

  const lines = useMemo(() => sceneLines(scene), [scene]);
  const line = lines[lineIndex];
  const isLastLine = lineIndex >= lines.length - 1;
  const hasChoices = !!scene.choices?.length;
  const showChoices = isLastLine && hasChoices && lineComplete && !showCard;
  const showMinigame = isLastLine && !!scene.minigame && lineComplete && !showCard;
  const showAdvance = lineComplete && !showChoices && !showMinigame && !showCard;

  // show the chapter card on scene entry
  useEffect(() => {
    setShowCard(!!scene.card);
  }, [scene.id, scene.card]);

  // reset completion state per line
  useEffect(() => {
    setLineComplete(false);
  }, [lineIndex, scene.id]);

  // dramatic swell when entering a reveal scene (after any card)
  const isReveal = scene.cinematic === "reveal";
  useEffect(() => {
    if (isReveal && !showCard) dramaSwell();
  }, [isReveal, scene.id, showCard]);

  // ── voice playback ──────────────────────────────
  // narrate the chapter card while it is shown
  useEffect(() => {
    if (showCard && scene.card) playClip(clipPath.card(scene.id));
  }, [showCard, scene.id, scene.card]);

  // voice the current line (also fires when a card is dismissed → plays line 0)
  useEffect(() => {
    if (showCard) return;
    const a = lines[lineIndex]?.audio;
    if (a) playClip(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.id, lineIndex, showCard]);

  // stop audio when the scene view unmounts (replay / back to title)
  useEffect(() => () => stopVoice(), []);

  const handleStageClick = useCallback(() => {
    if (showChoices || showMinigame) return;
    const box = boxRef.current;
    if (box && !box.isDone()) {
      box.complete();
      setLineComplete(true);
      return;
    }
    onAdvance();
  }, [showChoices, showMinigame, onAdvance]);

  const onComplete = useCallback(() => setLineComplete(true), []);
  const dismissCard = useCallback(() => setShowCard(false), []);

  const finishMinigame = useCallback(
    (delta: number) => {
      const mg = scene.minigame;
      if (!mg) return;
      onChoose({ text: "", tone: delta <= 0 ? "safe" : "risky", suspicionDelta: delta, next: mg.next });
    },
    [scene.minigame, onChoose],
  );

  // shake on any banana-reveal line (reveal scene + the iconic ending line)
  const shaking = useMemo(
    () => scene.cinematic === "reveal" && !!line?.text.toLowerCase().includes("banana"),
    [scene.cinematic, line],
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
          <Image src={scene.background} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* sprites (revealed after the card) */}
      <AnimatePresence>
        {!showCard &&
          scene.sprites?.map((s) => (
            <motion.div
              key={`${scene.id}-${s.src}`}
              initial={{ opacity: 0, x: s.position === "left" ? -60 : s.position === "right" ? 60 : 0, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`absolute bottom-0 z-10 h-[68%] w-[55%] sm:h-[82%] sm:w-[40%] ${POS[s.position ?? "center"]}`}
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
      {scene.letterbox && !showCard && (
        <>
          <div className="letterbox-bar top" />
          <div className="letterbox-bar bottom" />
        </>
      )}

      {/* click catcher (below dialogue/choices) */}
      <button
        aria-label="Advance"
        onClick={handleStageClick}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer"
      />

      {/* bottom stack: choices sit ABOVE the dialogue box (no overlap) */}
      {!showCard && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 px-4 pb-5 sm:gap-3 sm:px-10 sm:pb-8">
          {showChoices && scene.choices && (
            <div className="pointer-events-auto w-full">
              <ChoiceMenu choices={scene.choices} onChoose={onChoose} />
            </div>
          )}
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
        </div>
      )}

      {/* timed mini-game */}
      <AnimatePresence>
        {showMinigame && <DeleteEvidenceGame key={`mg-${scene.id}`} onFinish={finishMinigame} />}
      </AnimatePresence>

      {/* chapter / transition card */}
      <AnimatePresence>
        {showCard && scene.card && (
          <TransitionCard
            key={`card-${scene.id}`}
            time={scene.card.time}
            place={scene.card.place}
            bg={scene.card.bg}
            onDismiss={dismissCard}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
