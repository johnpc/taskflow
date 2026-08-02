import { useCalendarMonth } from './useCalendarMonth';
import { useCalendarDrag } from './useCalendarDrag';
import { useCalendarReschedule } from './useCalendarReschedule';
import { CalendarCell } from './CalendarCell';
import { MonthGridSkeleton } from './MonthGridSkeleton';
import { LoadState } from '../shell/LoadState';

const WEEKDAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');

/** The month-grid view: a Sunday-first calendar matrix with each day's dated
 * tasks as chips, paging a month at a time. Drag a chip onto another day to
 * reschedule it. Renders only. */
export function CalendarMonth() {
  const { query, weeks, title, atStart, prevMonth, nextMonth, goThisMonth } = useCalendarMonth();
  const reschedule = useCalendarReschedule();
  const drag = useCalendarDrag((patch) => reschedule.mutate(patch));

  return (
    <>
      <div className="calendar__nav">
        <h1 className="tf-heading calendar__title">{title}</h1>
        <span className="calendar__nav-controls">
          <button
            type="button"
            className="calendar__nav-btn"
            data-testid="calendar-prev"
            aria-label="Previous month"
            disabled={atStart}
            onClick={prevMonth}
          >
            ‹
          </button>
          <button
            type="button"
            className="calendar__nav-btn"
            data-testid="calendar-today"
            onClick={goThisMonth}
          >
            Today
          </button>
          <button
            type="button"
            className="calendar__nav-btn"
            data-testid="calendar-next"
            aria-label="Next month"
            onClick={nextMonth}
          >
            ›
          </button>
        </span>
      </div>
      <LoadState
        isLoading={query.isLoading}
        isError={query.isError}
        isEmpty={false}
        onRetry={query.refetch}
        skeleton={<MonthGridSkeleton />}
      >
        <div className="calendar-grid" data-testid="calendar-grid">
          {WEEKDAYS.map((d) => (
            <div key={d} className="calendar-grid__dow">
              {d}
            </div>
          ))}
          {weeks.flat().map((cell) => (
            <CalendarCell key={cell.date} cell={cell} drag={drag} />
          ))}
        </div>
      </LoadState>
    </>
  );
}
