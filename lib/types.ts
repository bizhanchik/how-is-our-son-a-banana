// Core data model for the "How Is Our Son A Banana?" visual novel.

export type Speaker = "Strawberrina" | "Bananito" | "Strawberto" | "Doctor" | "Narrator";

export type SpritePosition = "left" | "center" | "right";

export type ChoiceTone = "risky" | "safe" | "bold";

export interface DialogueLine {
  speaker: Speaker;
  text: string;
}

export interface Choice {
  text: string;
  tone: ChoiceTone;
  suspicionDelta: number;
  flag?: string;
  next: string;
}

export interface SpriteSlot {
  /** path under /public, e.g. /sprites/strawberrina-neutral.png */
  src: string;
  name: Speaker;
  position?: SpritePosition;
}

export interface Scene {
  id: string;
  background: string; // /bg/... (also used as the video poster / fallback)
  /** optional looping background video (/video/...) that replaces the still image */
  video?: string;
  /** chapter / transition card shown on scene entry */
  card?: { time?: string; place?: string; bg?: string };
  /** characters on screen for this scene (rendered behind the dialogue box) */
  sprites?: SpriteSlot[];
  /** italic true-crime narrator line shown top-center before/with dialogue */
  voiceover?: string;
  dialogue: DialogueLine[];
  choices?: Choice[];
  /** interactive mini-game shown after the dialogue instead of choices */
  minigame?: { kind: "delete-evidence"; next: string };
  /** if no choices, where to go after the last dialogue line */
  next?: string;
  /** the delivery-room scene that branches into an ending based on suspicion */
  isBranchPoint?: boolean;
  /** ending screens */
  isEnding?: boolean;
  endingKind?: "perfect" | "exposed" | "closecall";
  /** cinematic flags consumed by SceneView for extra motion */
  cinematic?: "montage" | "reveal";
  letterbox?: boolean;
}

export type Phase = "title" | "playing" | "ending";

export interface GameState {
  phase: Phase;
  sceneId: string;
  lineIndex: number;
  /** hidden from the player until the ending recap */
  suspicion: number;
  flags: string[];
  history: string[];
}

export type GameAction =
  | { type: "START" }
  | { type: "ADVANCE" }
  | { type: "CHOOSE"; choice: Choice }
  | { type: "GOTO"; sceneId: string }
  | { type: "RESET" };
