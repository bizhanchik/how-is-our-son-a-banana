"use client";

import { useCallback, useReducer, useState } from "react";
import type { Choice } from "@/lib/types";
import { reducer, initialState } from "@/lib/reducer";
import { scenes } from "@/lib/scenes";
import { setVoiceMuted, stopVoice } from "@/lib/audio";
import { setMuted as setSfxMuted } from "@/lib/sfx";
import TitleScreen from "./TitleScreen";
import SceneView from "./SceneView";
import EndingScreen from "./EndingScreen";

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [recap, setRecap] = useState(false);
  const [muted, setMuted] = useState(false);

  const scene = scenes[state.sceneId];

  const handleAdvance = useCallback(() => {
    const s = scenes[state.sceneId];
    if (!s) return;
    // finished walking through an ending scene → show the recap overlay
    if (s.isEnding && state.lineIndex >= s.dialogue.length - 1) {
      stopVoice();
      setRecap(true);
      return;
    }
    dispatch({ type: "ADVANCE" });
  }, [state.sceneId, state.lineIndex]);

  const handleChoose = useCallback((c: Choice) => dispatch({ type: "CHOOSE", choice: c }), []);

  const start = useCallback(() => {
    setRecap(false);
    dispatch({ type: "START" });
  }, []);

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
      return next;
    });
  }, []);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <div className="mx-auto h-full w-full max-w-[1600px]">
        {state.phase === "title" && <TitleScreen onStart={start} />}

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

        {/* sound toggle */}
        {state.phase !== "title" && (
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="absolute right-3 top-3 z-[60] rounded-full border border-gold/30 bg-black/60 px-3 py-2 text-lg backdrop-blur-md transition-colors hover:bg-black/80 sm:right-5 sm:top-5"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        )}
      </div>
    </main>
  );
}
