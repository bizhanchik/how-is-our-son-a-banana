"use client";

import { useCallback, useReducer, useState } from "react";
import type { Choice } from "@/lib/types";
import { reducer, initialState } from "@/lib/reducer";
import { scenes } from "@/lib/scenes";
import TitleScreen from "./TitleScreen";
import SceneView from "./SceneView";
import EndingScreen from "./EndingScreen";

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [recap, setRecap] = useState(false);

  const scene = scenes[state.sceneId];

  const handleAdvance = useCallback(() => {
    const s = scenes[state.sceneId];
    if (!s) return;
    // finished walking through an ending scene → show the recap overlay
    if (s.isEnding && state.lineIndex >= s.dialogue.length - 1) {
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
    dispatch({ type: "RESET" });
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
      </div>
    </main>
  );
}
