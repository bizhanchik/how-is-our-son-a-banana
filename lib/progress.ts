// Tracks which endings the player has discovered (localStorage).

const KEY = "berry_endings_v1";
export const TOTAL_ENDINGS = 3;

export function recordEnding(kind: string) {
  if (typeof window === "undefined") return;
  try {
    const found = new Set(getEndingsFound());
    found.add(kind);
    localStorage.setItem(KEY, JSON.stringify([...found]));
  } catch {
    /* ignore */
  }
}

export function getEndingsFound(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
