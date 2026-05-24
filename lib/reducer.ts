import type { GameAction, GameState } from "./types";
import { scenes, FIRST_SCENE } from "./scenes";
import { sceneLineCount } from "./lines";

export const initialState: GameState = {
  phase: "title",
  sceneId: FIRST_SCENE,
  lineIndex: 0,
  suspicion: 0,
  flags: [],
  history: [],
};

/** Routes through a baby-reveal scene before the ending reactions.
 *  >= 3 → exposed (banana) · 1-2 → close call (lucky red, but he's watching) · <= 0 → perfect. */
export function resolveEnding(suspicion: number): string {
  if (suspicion >= 3) return "reveal-exposed";
  if (suspicion >= 1) return "reveal-closecall";
  return "reveal-perfect";
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

      // still more lines to reveal (narrator voiceover counts as line 0)
      if (state.lineIndex < sceneLineCount(scene) - 1) {
        return { ...state, lineIndex: state.lineIndex + 1 };
      }

      // last line reached — choices or a mini-game take over (handled in the view)
      if (scene.choices && scene.choices.length > 0) return state;
      if (scene.minigame) return state;

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
