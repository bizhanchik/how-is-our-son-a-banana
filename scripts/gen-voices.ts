// Generate ElevenLabs voice clips for every dialogue line, voiceover, and chapter card.
// Run: npx tsx scripts/gen-voices.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { scenes } from "../lib/scenes";
import type { Speaker } from "../lib/types";

const ROOT = join(process.cwd());
const OUT = join(ROOT, "public", "audio");
mkdirSync(OUT, { recursive: true });

// API key from .env.local
const env = readFileSync(join(ROOT, ".env.local"), "utf8");
const KEY = (env.match(/ELEVENLABS_API_KEY=(.+)/)?.[1] ?? "").trim();
if (!KEY) throw new Error("no ELEVENLABS_API_KEY in .env.local");

const VOICE: Record<Speaker, string> = {
  Strawberrina: "pFZP5JQG7iQjIQuC4Bku", // Lily — velvety actress
  Bananito: "cjVigY5qzO86Huf0OWal", // Eric — smooth, trustworthy
  Strawberto: "iP95p4xoKVk53GoZ742B", // Chris — charming, down-to-earth
  Narrator: "JBFqnCBsd6RMkjVDRZzb", // George — warm storyteller
  Doctor: "onwK4e9ZLuTAKqWW03F9", // Daniel — steady broadcaster
};

const PRIMARY_MODEL = "eleven_v3";
const FALLBACK_MODEL = "eleven_multilingual_v2";

// strip emoji + parens markers, keep the words & dramatic punctuation
function sanitize(t: string): string {
  return t
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}️]/gu, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface Job { key: string; speaker: Speaker; text: string }
const jobs: Job[] = [];

for (const id of Object.keys(scenes)) {
  const s = scenes[id];
  if (s.card) {
    const txt = [s.card.time, s.card.place].filter(Boolean).join(". ");
    if (txt) jobs.push({ key: `${id}__card`, speaker: "Narrator", text: txt + "." });
  }
  if (s.voiceover) jobs.push({ key: `${id}__vo`, speaker: "Narrator", text: s.voiceover });
  s.dialogue.forEach((line, i) => {
    const text = sanitize(line.text);
    if (text) jobs.push({ key: `${id}__L${i}`, speaker: line.speaker, text });
  });
}

async function tts(job: Job): Promise<"ok" | "skip" | "fail"> {
  const file = join(OUT, `${job.key}.mp3`);
  if (existsSync(file)) return "skip";
  for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE[job.speaker]}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: job.text,
          model_id: model,
          voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.4, use_speaker_boost: true },
        }),
      },
    );
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(file, buf);
      return "ok";
    }
    const err = await res.text();
    if (model === PRIMARY_MODEL && /model|v3|permission|only/i.test(err)) continue; // try fallback
    console.error(`FAIL ${job.key} [${model}] ${res.status}: ${err.slice(0, 160)}`);
    if (model === FALLBACK_MODEL) return "fail";
  }
  return "fail";
}

// limited concurrency
async function run() {
  console.log(`audio dir: ${OUT}`);
  console.log(`already present: ${readdirSync(OUT).filter((f) => f.endsWith(".mp3")).length} mp3`);
  console.log(`jobs: ${jobs.length}`);
  let ok = 0, skip = 0, fail = 0, done = 0;
  const CONC = 3;
  let idx = 0;
  async function worker() {
    while (idx < jobs.length) {
      const job = jobs[idx++];
      const r = await tts(job);
      done++;
      if (r === "ok") ok++; else if (r === "skip") skip++; else fail++;
      if (r !== "skip") console.log(`[${done}/${jobs.length}] ${r.toUpperCase()} ${job.key} (${job.speaker})`);
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log(`DONE ok=${ok} skip=${skip} fail=${fail}`);
}
run();
