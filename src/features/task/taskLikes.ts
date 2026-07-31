/** Pure helpers for task likes (Asana hearts). A task's `likedBy` is the list of
 * member emails who liked it; the count is its length and "I liked it" is
 * membership. Toggling adds/removes the current user. Case-insensitive on email
 * (Cognito emails can vary in case) and null-safe. */

/** Normalize an email for comparison — trimmed + lowercased. */
function norm(email: string): string {
  return email.trim().toLowerCase();
}

/** True when `me` is in the liked-by list (case-insensitive). */
export function hasLiked(
  likedBy: readonly (string | null)[] | null | undefined,
  me: string,
): boolean {
  const mine = norm(me);
  return (likedBy ?? []).some((e) => e != null && norm(e) === mine);
}

/** The number of distinct likes (ignores null/blank entries). */
export function likeCount(likedBy: readonly (string | null)[] | null | undefined): number {
  return (likedBy ?? []).filter((e) => e != null && e.trim() !== '').length;
}

/** The next `likedBy` list after `me` toggles their like — removes `me` if
 * already present, otherwise appends. Preserves the other members' entries and
 * drops any null/blank noise. */
export function toggleLike(
  likedBy: readonly (string | null)[] | null | undefined,
  me: string,
): string[] {
  const clean = (likedBy ?? []).filter((e): e is string => e != null && e.trim() !== '');
  if (hasLiked(clean, me)) {
    const mine = norm(me);
    return clean.filter((e) => norm(e) !== mine);
  }
  return [...clean, me];
}
