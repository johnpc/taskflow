import { assigneeInitials } from '../task/assigneeInitials';

/** The name to show for a user: their display name if set, else their email.
 * Pure. */
export function displayLabel(email: string, displayName: string | null | undefined): string {
  return displayName?.trim() || email;
}

/** Up-to-two initials for a user, from their display name if set (e.g. "Ada
 * Lovelace" → "AL"), else derived from the email local part. Pure. */
export function displayInitials(email: string, displayName: string | null | undefined): string {
  const name = displayName?.trim();
  if (!name) return assigneeInitials(email);
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
  return letters.toUpperCase();
}
