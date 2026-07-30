/** Whether completing a task should fire the confetti celebration. Asana shows
 * its creature intermittently, not on every complete — so we celebrate every
 * Nth completion (and always the very first). Deterministic in the running
 * count so it's testable and never random. */
const EVERY = 5;

export function shouldCelebrate(completionCount: number): boolean {
  if (completionCount <= 0) return false;
  return completionCount === 1 || completionCount % EVERY === 0;
}
