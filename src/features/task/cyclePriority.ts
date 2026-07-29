import type { Priority } from './taskMeta';

const ORDER: Priority[] = ['NONE', 'LOW', 'MEDIUM', 'HIGH'];

/** The next priority in the cycle NONE → LOW → MEDIUM → HIGH → NONE. Pure so the
 * card quick-edit cycler is deterministic + testable. */
export function cyclePriority(current: Priority | null | undefined): Priority {
  const i = ORDER.indexOf((current ?? 'NONE') as Priority);
  return ORDER[(i + 1) % ORDER.length];
}
