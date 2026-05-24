"use client";

import { useCallback, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Choice } from "@/lib/types";
import { reducer, initialState } from "@/lib/reducer";
import { scenes } from "@/lib/scenes";
import { sceneLineCount } from "@/lib/lines";
import { setVoiceMuted, stopVoice } from "@/lib/audio";
import { setMuted as setSfxMuted } from "@/lib/sfx";
import { setMusicPlaying, setMusicVolume } from "@/lib/music";
import TitleScreen from "./TitleScreen";
import SceneView from "./SceneView";
import EndingScreen from "./EndingScreen";
import Preloader from "./Preloader";

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [recap, setRecap] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicOff, setMusicOff] = useState(false);
  const [musicVol, setMusicVol] = useState(0.14);
  const [flash, setFlash] = useState<Choice["tone"] | null>(null);
  const [loading, setLoading] = useState(false);
  const preloadedRef = useRef(false);

  const scene = scenes[state.sceneId];

  const handleAdvance = useCallback(() => {
    const s = scenes[state.sceneId];
    if (!s) return;
    // finished walking through an ending scene → show the recap overlay
    if (s.isEnding && state.lineIndex >= sceneLineCount(s) - 1) {
      stopVoice();
      setRecap(true);
      return;
    }
    dispatch({ type: "ADVANCE" });
  }, [state.sceneId, state.lineIndex]);

  const handleChoose = useCallback((c: Choice) => {
    // brief tone-colored feedback flash (no number revealed)
    setFlash(c.tone);
    window.setTimeout(() => setFlash(null), 480);
    dispatch({ type: "CHOOSE", choice: c });
  }, []);

  const FLASH_COLOR: Record<Choice["tone"], string> = {
    risky: "bg-strawberry/25",
    bold: "bg-gold/25",
    safe: "bg-sky-400/20",
  };

  const enterGame = useCallback(() => {
    preloadedRef.current = true;
    setLoading(false);
    setRecap(false);
    dispatch({ type: "START" });
  }, []);

  // Begin → start music on this user gesture, then preload everything (first time only)
  const start = useCallback(() => {
    setMusicPlaying(!muted && !musicOff);
    if (preloadedRef.current) {
      enterGame();
    } else {
      setLoading(true);
    }
  }, [muted, musicOff, enterGame]);

  const replay = useCallback(() => {
    setRecap(false);
    stopVoice();
    dispatch({ type: "RESET" });
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      setVoiceMuted(next);
      setSfxMuted(next);
      setMusicPlaying(!next && !musicOff); // master mute also silences music
      return next;
    });
  }, [musicOff]);

  const toggleMusic = useCallback(() => {
    setMusicOff((off) => {
      const next = !off;
      setMusicPlaying(!next && !muted);
      return next;
    });
  }, [muted]);

  const changeVolume = useCallback((v: number) => {
    setMusicVol(v);
    setMusicVolume(v);
  }, []);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <div className="mx-auto h-full w-full max-w-[1600px]">
        {state.phase === "title" && !loading && <TitleScreen onStart={start} />}

        {loading && <Preloader onDone={enterGame} />}

        {state.phase !== "title" && scene && (
          <SceneView
            scene={scene}
            lineIndex={state.lineIndex}
            onAdvance={handleAdvance}
            onChoose={handleChoose}
          />
        )}

        {recap && scene?.endingKind && (
          <EndingScreen
            kind={scene.endingKind}
            suspicion={state.suspicion}
            onReplay={replay}
          />
        )}

        {/* choice feedback flash */}
        <AnimatePresence>
          {flash && (
            <motion.div
              key={flash + Date.now()}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.48 }}
              className={`pointer-events-none absolute inset-0 z-[55] ${FLASH_COLOR[flash]}`}
            />
          )}
        </AnimatePresence>

        {/* sound + music controls */}
        {state.phase !== "title" && (
          <div className="absolute right-3 top-3 z-[60] flex items-center gap-2 sm:right-5 sm:top-5">
            <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-black/60 px-3 py-2 backdrop-blur-md">
              <button
                onClick={toggleMusic}
                aria-label={musicOff ? "Music off" : "Music on"}
                title={musicOff ? "Music off" : "Music on"}
                className={`text-lg leading-none transition-opacity hover:opacity-100 ${musicOff ? "opacity-40" : ""}`}
              >
                🎵
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={musicVol}
                onChange={(e) => changeVolume(Number(e.target.value))}
                aria-label="Music volume"
                title="Music volume"
                style={{ accentColor: "#e8b04b" }}
                className="h-1 w-16 cursor-pointer sm:w-24"
              />
            </div>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              title={muted ? "Unmute" : "Mute"}
              className="rounded-full border border-gold/30 bg-black/60 px-3 py-2 text-lg backdrop-blur-md transition-colors hover:bg-black/80"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
