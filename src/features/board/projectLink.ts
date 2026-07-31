/** The shareable deep link to a project: the app origin + its route. Pure so
 * the copy action can be tested without a real window/clipboard. */
export function projectLink(origin: string, id: string): string {
  return `${origin.replace(/\/$/, '')}/projects/${id}`;
}
