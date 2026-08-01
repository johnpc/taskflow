/** True when a record was edited after creation — i.e. its updatedAt is
 * meaningfully after its createdAt. A small threshold (2s) avoids a false
 * "(edited)" from the create round-trip, where updatedAt ≈ createdAt. Pure. */
const THRESHOLD_MS = 2000;

export function wasEdited(
  createdAt: string | null | undefined,
  updatedAt: string | null | undefined,
): boolean {
  if (!createdAt || !updatedAt) return false;
  const created = Date.parse(createdAt);
  const updated = Date.parse(updatedAt);
  if (Number.isNaN(created) || Number.isNaN(updated)) return false;
  return updated - created > THRESHOLD_MS;
}
