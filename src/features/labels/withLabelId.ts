/** Add a label id to a task's labelIds set (idempotent — no duplicates), keeping
 * the others and dropping null/blank noise. Pure. Distinct from toggleLabelId:
 * this only ADDS, for bulk "add label to selected". */
export function withLabelId(labelIds: (string | null)[] | null | undefined, id: string): string[] {
  const set = new Set((labelIds ?? []).filter((x): x is string => !!x));
  set.add(id);
  return [...set];
}

/** Remove a label id from a task's labelIds set (no-op if absent), keeping the
 * others and dropping null/blank noise. Pure — for bulk "remove label". */
export function withoutLabelId(
  labelIds: (string | null)[] | null | undefined,
  id: string,
): string[] {
  return (labelIds ?? []).filter((x): x is string => !!x && x !== id);
}
