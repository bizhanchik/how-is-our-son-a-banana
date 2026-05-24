// Voice-line playback. A SINGLE shared <audio> element guarantees only one clip
// ever plays — setting .src stops the previous clip, so voices can't stack/overlap.
// Files: /audio/<sceneId>__card.mp3 | __vo.mp3 | __L<i>.mp3. Missing files no-op.

let el: HTMLAudioElement | null = null;
let token = 0;
let muted = false;

function getEl(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!el) el = new Audio();
  return el;
}

export function setVoiceMuted(v: boolean) {
  muted = v;
  if (muted) stopVoice();
}
export function isVoiceMuted() {
  return muted;
}

export function stopVoice() {
  token++; // invalidate any in-flight clip's resolve
  if (el) {
    el.pause();
    el.removeAttribute("src");
  }
}

/** Play a clip on the shared element; resolves when it ends, errors, is missing, or is muted. */
export function playClip(path: string): Promise<void> {
  return new Promise((resolve) => {
    const a = getEl();
    if (!a) return resolve();
    const my = ++token; // newest call wins
    a.pause();
    if (muted) return resolve();
    a.onended = null;
    a.onerror = null;
    a.src = path;
    a.currentTime = 0;
    const done = () => {
      if (my === token) resolve();
    };
    a.onended = done;
    a.onerror = done; // 404 / decode error → continue silently
    a.play().catch(done);
  });
}

export const clipPath = {
  card: (id: string) => `/audio/${id}__card.mp3`,
  vo: (id: string) => `/audio/${id}__vo.mp3`,
  line: (id: string, i: number) => `/audio/${id}__L${i}.mp3`,
};
