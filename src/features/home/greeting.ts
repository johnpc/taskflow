/** Time-of-day greeting for a given local hour (0–23). Pure so it's testable;
 * the caller passes `new Date().getHours()`. */
export function greeting(hour: number): string {
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
