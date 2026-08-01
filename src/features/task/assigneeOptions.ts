/** The assignee options for a task/subtask: the project's members, with the
 * signed-in user ensured present so a solo project can still self-assign. Pure —
 * drops null/blank member entries. Shared by TaskAssignment + the subtask
 * checklist so the "who can I assign to" rule lives in one place. */
export function assigneeOptions(
  members: (string | null)[] | null | undefined,
  currentEmail: string | null,
): string[] {
  const clean = (members ?? []).filter((m): m is string => !!m);
  return currentEmail && !clean.includes(currentEmail) ? [...clean, currentEmail] : clean;
}
