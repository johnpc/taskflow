/** The Calendar's chosen layout (two-week List or Month grid), persisted in
 * localStorage so it sticks across visits. Pure read/write helpers; mirrors the
 * board viewMode store. Defaults to List (the original view). */

export type CalendarView = 'LIST' | 'MONTH';

const KEY = 'tf-calendar-view';

/** Read the stored calendar view, defaulting to 'LIST'. */
export function readCalendarView(): CalendarView {
  try {
    if (localStorage.getItem(KEY) === 'MONTH') return 'MONTH';
  } catch {
    /* storage unavailable — use the default */
  }
  return 'LIST';
}

/** Persist the chosen calendar view (best-effort). */
export function writeCalendarView(view: CalendarView): void {
  try {
    localStorage.setItem(KEY, view);
  } catch {
    /* ignore */
  }
}
