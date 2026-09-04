/**
 * intro-state.ts
 *
 * Tracks whether the cinematic intro has already played in the current
 * browser session.  Uses sessionStorage so it resets on new tabs/windows
 * but NOT on internal SPA navigation.
 *
 * Server-safe: all access is guarded by typeof window checks.
 */

const KEY = "rn_intro_played";

export function hasIntroPlayed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroPlayed(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // ignore – private browsing etc.
  }
}
