import { scenes } from "./scenes";
import { sceneLines } from "./lines";
import { clipPath } from "./audio";

// Every URL the game can show/play — used by the preloader so nothing
// streams in mid-scene.
export function collectAssets(): string[] {
  const set = new Set<string>();
  set.add("/music/music.mp3");
  for (const id of Object.keys(scenes)) {
    const s = scenes[id];
    if (s.background) set.add(s.background);
    if (s.video) set.add(s.video);
    if (s.card?.bg) set.add(s.card.bg);
    if (s.card) set.add(clipPath.card(id));
    s.sprites?.forEach((sp) => set.add(sp.src));
    sceneLines(s).forEach((ln) => set.add(ln.audio));
  }
  return [...set];
}
