import type { GameAction, GameState } from "./types";
import { scenes, FIRST_SCENE } from "./scenes";

export const initialState: GameState = {
  phase: "title",
  sceneId: FIRST_SCENE,
  lineIndex: 0,
  suspicion: 0,
  flags: [],
  history: [],
};

/** suspicion >= 3 → exposed; otherwise she gets away with it */
export function resolveEnding(suspicion: number): string {
  return suspicion >= 3 ? "ending-exposed" : "ending-perfect";
}

function enterScene(state: GameState, sceneId: string): GameState {
  return {
    ...state,
    sceneId,
    lineIndex: 0,
    phase: scenes[sceneId]?.isEnding ? "ending" : "playing",
    history: [...state.history, sceneId],
  };
}

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START":
      return enterScene({ ...initialState }, FIRST_SCENE);

    case "RESET":
      return { ...initialState };

    case "GOTO":
      return enterScene(state, action.sceneId);

    case "CHOOSE": {
      const { choice } = action;
      const flags = choice.flag && !state.flags.includes(choice.flag)
        ? [...state.flags, choice.flag]
        : state.flags;
      return enterScene(
        { ...state, suspicion: state.suspicion + choice.suspicionDelta, flags },
        choice.next,
      );
    }

    case "ADVANCE": {
      const scene = scenes[state.sceneId];
      if (!scene) return state;

      // still more dialogue lines to reveal
      if (state.lineIndex < scene.dialogue.length - 1) {
        return { ...state, lineIndex: state.lineIndex + 1 };
      }

      // last line reached — if there are choices, ChoiceMenu takes over (no-op here)
      if (scene.choices && scene.choices.length > 0) return state;

      // branch point: compute ending from accumulated suspicion
      if (scene.isBranchPoint) {
        return enterScene(state, resolveEnding(state.suspicion));
      }

      // auto-advance to the next scene
      if (scene.next && scene.next !== "__ending__") {
        return enterScene(state, scene.next);
      }

      // ending screens stay put; EndingScreen handles replay
      return state;
    }

    default:
      return state;
  }
}
