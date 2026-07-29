/** The shareable deep link to a task: the app origin + its route. Pure so the
 * copy-link button can be tested without a real window/clipboard. */
export function taskLink(origin: string, id: string): string {
  return `${origin.replace(/\/$/, '')}/tasks/${id}`;
}
