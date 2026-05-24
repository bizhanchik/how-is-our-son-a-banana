// Procedural Web Audio SFX — no asset files. Lazily created on first user gesture.

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(v: boolean) {
  muted = v;
}
export function isMuted() {
  return muted;
}

function blip(freq: number, durMs: number, type: OscillatorType, gain: number) {
  const c = ac();
  if (!c || muted) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durMs / 1000);
  osc.connect(g).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + durMs / 1000 + 0.02);
}

/** soft typewriter tick */
export function tick() {
  blip(1400 + Math.random() * 400, 18, "square", 0.015);
}

/** UI click on advance */
export function click() {
  blip(520, 50, "triangle", 0.05);
}

/** dramatic descending sting on a choice / reveal */
export function sting() {
  const c = ac();
  if (!c || muted) return;
  const notes = [392, 311, 233]; // G4 → Eb4 → Bb3, minor & ominous
  notes.forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sawtooth";
    const t = c.currentTime + i * 0.12;
    osc.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}

/** big swell for the banana reveal */
export function dramaSwell() {
  const c = ac();
  if (!c || muted) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  const t = c.currentTime;
  osc.frequency.setValueAtTime(110, t);
  osc.frequency.exponentialRampToValueAtTime(440, t + 1.2);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 1.7);
}
