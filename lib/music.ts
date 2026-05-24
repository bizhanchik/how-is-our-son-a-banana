// Looping, quiet background music. Single element; starts on first user gesture.

let el: HTMLAudioElement | null = null;

function getEl(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!el) {
    el = new Audio("/music/music.mp3");
    el.loop = true;
    el.volume = 0.14; // quiet bed under the voices
  }
  return el;
}

export function setMusicPlaying(on: boolean) {
  const a = getEl();
  if (!a) return;
  if (on) a.play().catch(() => {});
  else a.pause();
}

export function setMusicVolume(v: number) {
  const a = getEl();
  if (a) a.volume = v;
}
