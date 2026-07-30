/** A single confetti piece's presentation: horizontal start (%), a color token,
 * a fall delay + duration (s), and a horizontal drift (px). Deterministic by
 * index so the burst is testable and stable across renders (no Math.random,
 * which is unavailable/unwanted here). */
export interface ConfettiPiece {
  left: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
}

const COLORS = [
  'var(--tf-proj-rose, #f43f5e)',
  'var(--tf-proj-amber, #f59e0b)',
  'var(--tf-proj-emerald, #10b981)',
  'var(--tf-proj-sky, #0ea5e9)',
  'var(--tf-proj-violet, #8b5cf6)',
  'var(--tf-proj-indigo, #6366f1)',
];

/** Build `count` confetti pieces spread across the width, cycling colors and
 * varying delay/duration/drift by index for a lively-but-deterministic burst. */
export function confettiPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.round(((i * 97) % 100) + 0.5),
    color: COLORS[i % COLORS.length],
    delay: (i % 5) * 0.06,
    duration: 1.1 + (i % 4) * 0.18,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 12),
  }));
}
