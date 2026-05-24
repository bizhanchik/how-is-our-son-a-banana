import type { Scene, Speaker } from "./types";
import { clipPath } from "./audio";

// The full ordered list of spoken lines for a scene. The scene's narrator
// `voiceover` becomes the FIRST line (shown in the dialogue box, advanced on
// click) instead of a separate top overlay — so the flow reads naturally.
export interface SpokenLine {
  speaker: Speaker;
  text: string;
  audio: string;
}

export function sceneLines(scene: Scene): SpokenLine[] {
  const out: SpokenLine[] = [];
  if (scene.voiceover) {
    out.push({ speaker: "Narrator", text: scene.voiceover, audio: clipPath.vo(scene.id) });
  }
  scene.dialogue.forEach((d, i) => {
    out.push({ speaker: d.speaker, text: d.text, audio: clipPath.line(scene.id, i) });
  });
  return out;
}

export function sceneLineCount(scene: Scene): number {
  return scene.dialogue.length + (scene.voiceover ? 1 : 0);
}
