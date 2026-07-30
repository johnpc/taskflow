/** Pure helpers for editing a project's member list. Emails are normalized to
 * lowercase + trimmed and de-duplicated; the owner (first member) can't be
 * removed. Kept separate so the logic is unit-testable. */

/** Normalize an email for comparison + storage (trim + lowercase). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** A minimal email shape check — enough to reject obvious typos before a write. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Add an email to the members list (no-op if already present, case-insensitive).
 * Returns the new list; the input order is preserved with the new email last. */
export function addMember(members: string[], email: string): string[] {
  const normalized = normalizeEmail(email);
  if (members.some((m) => normalizeEmail(m) === normalized)) return members;
  return [...members, normalized];
}

/** Remove an email from the members list. The first member (the owner) is never
 * removed — losing the owner would orphan the project. */
export function removeMember(members: string[], email: string): string[] {
  const normalized = normalizeEmail(email);
  return members.filter((m, i) => i === 0 || normalizeEmail(m) !== normalized);
}
