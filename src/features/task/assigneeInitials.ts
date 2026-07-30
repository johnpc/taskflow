/** Up to two uppercase initials for an assignee, derived from the local part of
 * their email. "ada.lovelace@x.co" → "AL", "grace@x.co" → "G". Splits on dots,
 * hyphens, underscores, and plus. Pure. Returns '' for a blank input. */
export function assigneeInitials(email: string | null | undefined): string {
  const local = (email ?? '').split('@')[0];
  const parts = local.split(/[.\-_+]/).filter(Boolean);
  if (parts.length === 0) return '';
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
  return letters.toUpperCase();
}
