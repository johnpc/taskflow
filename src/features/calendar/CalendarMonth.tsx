import { useCalendarMonth } from './useCalendarMonth';
import { CalendarCell } from './CalendarCell';
import { LoadState } from '../shell/LoadState';

const WEEKDAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');

/** The month-grid view: a Sunday-first calendar matrix with each day's dated
 * tasks as chips, paging a month at a time. Renders only. */
export function CalendarMonth() {
  const { query, weeks, title, atStart, prevMonth, nextMonth, goThisMonth } = useCalendarMonth();

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
      >
        <div className="calendar-grid" data-testid="calendar-grid">
          {WEEKDAYS.map((d) => (
            <div key={d} className="calendar-grid__dow">
              {d}
            </div>
          ))}
          {weeks.flat().map((cell) => (
            <CalendarCell key={cell.date} cell={cell} />
          ))}
        </div>
      </LoadState>
    </>
  );
}
