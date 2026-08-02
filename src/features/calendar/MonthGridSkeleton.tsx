const WEEKDAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
const CELLS = Array.from({ length: 35 }); // 5 weeks × 7 days — the common month height

/** Grid-shaped loading placeholder for the month view, so the loading state
 * matches the calendar's shape (a 7-column grid) instead of the generic card
 * rows — no jarring shape swap when the data arrives. */
export function MonthGridSkeleton() {
  return (
    <div className="calendar-grid" data-testid="calendar-grid-skeleton" aria-hidden="true">
      {WEEKDAYS.map((d) => (
        <div key={d} className="calendar-grid__dow">
          {d}
        </div>
      ))}
      {CELLS.map((_, i) => (
        <div key={i} className="calendar-cell calendar-cell--skeleton">
          <span className="tf-skeleton calendar-cell__skeleton-day" />
        </div>
      ))}
    </div>
  );
}
