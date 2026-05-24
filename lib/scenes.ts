import type { Scene } from "./types";

// All 7 scenes + 2 endings. Required canonical lines are kept verbatim.
// Register: true-crime narrator over telenovela melodrama. ~60-90 spoken words/scene.

const SPR = {
  rinaNeutral: "/sprites/strawberrina-neutral.png",
  rinaFlirty: "/sprites/strawberrina-flirty.png",
  rinaPanicked: "/sprites/strawberrina-panicked.png",
  rinaPregnant: "/sprites/strawberrina-pregnant.png",
  bertoNeutral: "/sprites/strawberto-neutral.png",
  bertoSuspicious: "/sprites/strawberto-suspicious.png",
  bertoDevastated: "/sprites/strawberto-devastated.png",
  banaSmug: "/sprites/bananito-smug.png",
  banaIntense: "/sprites/bananito-intense.png",
} as const;

export const scenes: Record<string, Scene> = {
  // ─────────────────────────────────────────────── Scene 1
  morning: {
    id: "morning",
    background: "/bg/kitchen-morning.png",
    card: { time: "Tuesday Morning", place: "The Berry Residence", bg: "/bg/house-exterior.png" },
    sprites: [
      { src: SPR.bertoNeutral, name: "Strawberto", position: "left" },
      { src: SPR.rinaNeutral, name: "Strawberrina", position: "right" },
    ],
    voiceover:
      "Three years of marriage. Three years of the same breakfast. Three years of nothing.",
    dialogue: [
      { speaker: "Strawberto", text: "Morning, my little berry! I renewed our umbrella insurance. Twelve-year fixed. Locked it in." },
      { speaker: "Strawberto", text: "And the lawn? Mowed it in a spiral this time. Mother thinks spirals retain moisture." },
      { speaker: "Strawberrina", text: "...You spiraled the lawn." },
      { speaker: "Strawberto", text: "For us, sweetheart. Always for us." },
    ],
    choices: [
      { text: "💋 Kiss him goodbye", tone: "safe", suspicionDelta: -1, next: "office-day" },
      { text: "🙄 Walk out without a word", tone: "risky", suspicionDelta: 0, flag: "cold_wife", next: "office-day" },
    ],
  },

  // ─────────────────────────────────────────────── Scene 2
  "office-day": {
    id: "office-day",
    background: "/bg/office-day.png",
    card: { time: "9:00 AM", place: "Bananito Corp — 40th Floor", bg: "/bg/tower-exterior.png" },
    sprites: [{ src: SPR.banaSmug, name: "Bananito", position: "center" }],
    voiceover: "Forty floors up, the air tasted different. It tasted like a mistake she hadn't made yet.",
    dialogue: [
      { speaker: "Bananito", text: "Close the door, Strawberrina." },
      { speaker: "Bananito", text: "The quarterly numbers are... ripe. But that's not why I called you in." },
      { speaker: "Bananito", text: "Strawberrina... I need you to stay late tonight. We have... unfinished business." },
      { speaker: "Strawberrina", text: "(He hasn't blinked once. Why is my heart doing that?)" },
    ],
    choices: [
      { text: "😳 \"I have to go home to my husband\"", tone: "safe", suspicionDelta: -1, next: "office-night-safe" },
      { text: "🔥 \"Define 'late,' Mr. Bananito\"", tone: "bold", suspicionDelta: 1, flag: "bold_move", next: "office-night-affair" },
    ],
  },

  // ─────────────────────────────────────────────── Scene 3a (rejected → still happens)
  "office-night-safe": {
    id: "office-night-safe",
    background: "/bg/office-night.png",
    card: { time: "That Night" },
    sprites: [{ src: SPR.banaSmug, name: "Bananito", position: "center" }],
    voiceover: "She said no. She meant no. And then she said yes to one drink.",
    dialogue: [
      { speaker: "Bananito", text: "Then go home. After one drink. To clear the air. Purely professional." },
      { speaker: "Strawberrina", text: "...One drink." },
      { speaker: "Narrator", text: "One drink became three. Three became a decision she'd spend nine months regretting." },
    ],
    next: "affair-aftermath",
  },

  // ─────────────────────────────────────────────── Scene 3b (accepted)
  "office-night-affair": {
    id: "office-night-affair",
    background: "/bg/office-night.png",
    card: { time: "That Night" },
    cinematic: "montage",
    letterbox: true,
    voiceover: "The blinds came down. So did her better judgment.",
    dialogue: [
      { speaker: "Narrator", text: "A glass of whiskey, untouched, catching the last of the sunset." },
      { speaker: "Narrator", text: "A scatter of strawberry seeds across mahogany. A banana peel, slowly curling." },
      { speaker: "Narrator", text: "The city kept the secret. The city always does." },
    ],
    next: "affair-aftermath",
  },

  // ─────────────────────────────────────────────── Scene 4
  "affair-aftermath": {
    id: "affair-aftermath",
    background: "/bg/office-night.png",
    sprites: [{ src: SPR.banaIntense, name: "Bananito", position: "center" }],
    dialogue: [
      { speaker: "Bananito", text: "Get dressed. Your husband will wonder." },
      { speaker: "Bananito", text: "This never happened, Strawberrina. Understood?" },
      { speaker: "Strawberrina", text: "It meant nothing. Right?" },
      { speaker: "Bananito", text: "Now delete every text before your husband gets home. Quickly. He's already parking." },
    ],
    minigame: { kind: "delete-evidence", next: "home-aftermath" },
  },

  // ─────────────────────────────────────────────── Scene 4.5 (bridge)
  "home-aftermath": {
    id: "home-aftermath",
    background: "/bg/kitchen-morning.png",
    card: { time: "Six Weeks Later", place: "Home", bg: "/bg/house-exterior.png" },
    sprites: [
      { src: SPR.bertoNeutral, name: "Strawberto", position: "left" },
      { src: SPR.rinaNeutral, name: "Strawberrina", position: "right" },
    ],
    voiceover: "Six weeks passed. Strawberrina played the perfect wife. Almost too perfect.",
    dialogue: [
      { speaker: "Strawberto", text: "You've been glowing lately, sweetheart. I booked us a little getaway — just two berries and the sea." },
      { speaker: "Strawberrina", text: "(He has no idea. He really has no idea.)" },
      { speaker: "Strawberto", text: "I even practiced my swimming. For you." },
      { speaker: "Strawberrina", text: "That's... so sweet. I— excuse me one second. I don't feel so good." },
    ],
    next: "pregnancy-test",
  },

  // ─────────────────────────────────────────────── Scene 5
  "pregnancy-test": {
    id: "pregnancy-test",
    background: "/bg/bathroom.png",
    card: { time: "Minutes Later", place: "The Bathroom" },
    sprites: [{ src: SPR.rinaPanicked, name: "Strawberrina", position: "center" }],
    voiceover: "Two lines. Two pink, judgmental lines.",
    dialogue: [
      { speaker: "Strawberrina", text: "Okay. Okay. It's fine. It's statistically probably fine." },
      { speaker: "Strawberto", text: "Honey? Are you okay? You've been in there for an hour." },
      { speaker: "Strawberrina", text: "(Think, Strawberrina. Think faster than he loves you.)" },
    ],
    choices: [
      { text: "🤥 \"Just a stomach bug, sweetie!\"", tone: "risky", suspicionDelta: 0, flag: "delayed_reveal", next: "suspicion-night" },
      { text: "😭 Open the door, tell him you're pregnant", tone: "safe", suspicionDelta: -1, flag: "joyful_husband", next: "suspicion-night" },
    ],
  },

  // ─────────────────────────────────────────────── Scene 6
  "suspicion-night": {
    id: "suspicion-night",
    background: "/bg/bedroom-night.png",
    card: { time: "Six Months Later" },
    sprites: [{ src: SPR.rinaPregnant, name: "Strawberrina", position: "center" }],
    voiceover:
      "Six months along. He'd been quiet lately. Last week he found a hotel receipt and said nothing. The silence was the loudest thing in the house.",
    dialogue: [
      { speaker: "Strawberto", text: "(asleep) ...mm... love you... spiral the lawn..." },
      { speaker: "Narrator", text: "2:00 AM. The nightstand lit up like a confession." },
      { speaker: "Bananito", text: "Can't stop thinking about you. Are you free tomorrow? 🍌" },
    ],
    choices: [
      { text: "🤫 Reply \"Don't text me here,\" then delete", tone: "risky", suspicionDelta: -1, next: "hospital" },
      { text: "🚫 Block Bananito completely", tone: "safe", suspicionDelta: -3, flag: "committed_to_husband", next: "hospital" },
      { text: "😈 Reply \"Miss you 🍌\"", tone: "bold", suspicionDelta: 3, flag: "still_cheating", next: "hospital" },
    ],
  },

  // ─────────────────────────────────────────────── Scene 7 (branch point)
  hospital: {
    id: "hospital",
    background: "/bg/hospital.png",
    card: { time: "Nine Months Later", place: "St. Orchard Hospital", bg: "/bg/hospital.png" },
    sprites: [
      { src: SPR.rinaPregnant, name: "Strawberrina", position: "right" },
      { src: SPR.bertoNeutral, name: "Strawberto", position: "left" },
    ],
    isBranchPoint: true,
    cinematic: "reveal",
    voiceover:
      "Strawberrina prayed for one thing. A daughter. A strawberry daughter. With strawberry seeds. And no yellow.",
    dialogue: [
      { speaker: "Strawberto", text: "Breathe, my love. Our little berry is coming." },
      { speaker: "Strawberrina", text: "(Please be red. Please, please be red.)" },
      { speaker: "Doctor", text: "Almost there, Mrs. Berry. One more push... and... oh." },
    ],
    // next is resolved at runtime by the reducer based on suspicion
  },

  // ─────────────────────────────────────────────── Baby reveal (good)
  "reveal-perfect": {
    id: "reveal-perfect",
    background: "/bg/reveal-perfect.png",
    cinematic: "reveal",
    letterbox: true,
    dialogue: [
      { speaker: "Doctor", text: "Congratulations, Mr. and Mrs. Berry! It's a healthy baby... strawberry! Ten little seeds, red as can be." },
      { speaker: "Doctor", text: "A textbook berry. You must be so relieved." },
    ],
    next: "ending-perfect",
  },

  // ─────────────────────────────────────────────── Baby reveal (bad)
  "reveal-exposed": {
    id: "reveal-exposed",
    background: "/bg/reveal-exposed.png",
    cinematic: "reveal",
    letterbox: true,
    dialogue: [
      { speaker: "Doctor", text: "Congratulations! It's a... uhhh... ohhh." },
      { speaker: "Doctor", text: "It's... it's a banana? That's — huh. That's a first." },
    ],
    next: "ending-exposed",
  },

  // ─────────────────────────────────────────────── Ending A
  "ending-perfect": {
    id: "ending-perfect",
    background: "/bg/ending-perfect.png",
    isEnding: true,
    endingKind: "perfect",
    letterbox: true,
    voiceover: "And just like that, the universe decided to let one slide.",
    dialogue: [
      { speaker: "Strawberto", text: "(weeping) She has your seeds. She has your beautiful seeds." },
      { speaker: "Strawberrina", text: "She has someone's." },
      { speaker: "Narrator", text: "Through the window, a familiar silhouette. A slow, knowing nod. Bananito tips an invisible hat — and is gone." },
    ],
    next: "__ending__",
  },

  // ─────────────────────────────────────────────── Ending B
  "ending-exposed": {
    id: "ending-exposed",
    background: "/bg/ending-exposed.png",
    isEnding: true,
    endingKind: "exposed",
    cinematic: "reveal",
    letterbox: true,
    sprites: [{ src: SPR.bertoDevastated, name: "Strawberto", position: "center" }],
    dialogue: [
      { speaker: "Narrator", text: "Strawberto looked at the baby. Then at his wife. The telenovela strings began to swell." },
      { speaker: "Strawberto", text: "I am strawberry. You are strawberry. How is our son a banana?!" },
      { speaker: "Strawberrina", text: "...he tans easily?" },
      { speaker: "Narrator", text: "Strawberto walked out without his coat. Strawberrina was left holding everything she had left. Which was a banana." },
    ],
    next: "__ending__",
  },

  // ─────────────────────────────────────────────── Baby reveal (close call)
  "reveal-closecall": {
    id: "reveal-closecall",
    background: "/bg/reveal-perfect.png",
    cinematic: "reveal",
    letterbox: true,
    dialogue: [
      { speaker: "Doctor", text: "Congratulations — it's a healthy baby strawberry! Red as can be... mostly." },
      { speaker: "Doctor", text: "Funny. For a second I'd have sworn I saw a hint of yellow. Trick of the light, surely." },
    ],
    next: "ending-closecall",
  },

  // ─────────────────────────────────────────────── Ending C (close call)
  "ending-closecall": {
    id: "ending-closecall",
    background: "/bg/ending-perfect.png",
    isEnding: true,
    endingKind: "closecall",
    letterbox: true,
    sprites: [{ src: SPR.bertoSuspicious, name: "Strawberto", position: "center" }],
    voiceover: "She got the red she prayed for. But red doesn't erase a paper trail.",
    dialogue: [
      { speaker: "Strawberto", text: "She's perfect. The hotel receipt, the late nights, the new perfume... but she's perfect." },
      { speaker: "Strawberrina", text: "(He's counting. He's always counting now.)" },
      { speaker: "Narrator", text: "Strawberrina got away with it. Strawberto never raised his voice again — about anything. The house just got very, very quiet." },
    ],
    next: "__ending__",
  },
};

export const FIRST_SCENE = "morning";
