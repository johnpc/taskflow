import { useHistory } from 'react-router-dom';
import { horizonDates } from '../calendar/horizon';
import { todayISO } from '../task/today';
import { timelineLayout } from './timelineLayout';
import type { Column } from '../board/taskGrouping';
import './timeline.css';

const DAYS = 14;

/** Timeline (Gantt) view: a two-week horizontal axis with a day-header row and
 * one bar per open dated task, positioned start→due. Bars open the task. Reads
 * the same columns the board holds (flattened); no server round-trip. */
export function TimelineView({ columns }: { columns: Column[] }) {
  const history = useHistory();
  const start = todayISO();
  const days = horizonDates(start, DAYS);
  const bars = timelineLayout(
    columns.flatMap((c) => c.tasks),
    start,
    DAYS,
  );
  const cols = { gridTemplateColumns: `repeat(${DAYS}, minmax(28px, 1fr))` };

  return (
    <div className="timeline" data-testid="timeline-view">
      <div className="timeline__head" style={cols}>
        {days.map((d) => (
          <span
            key={d}
            className={d === start ? 'timeline__day timeline__day--today' : 'timeline__day'}
            data-testid={d === start ? 'timeline-today' : undefined}
          >
            {d === start ? 'Today' : Number(d.slice(8, 10))}
          </span>
        ))}
      </div>
      {bars.length === 0 ? (
        <p className="timeline__empty" data-testid="timeline-empty">
          No dated tasks in the next two weeks.
        </p>
      ) : (
        <div className="timeline__rows">
          {bars.map((b) => (
            <div key={b.task.id} className="timeline__row" style={cols}>
              <button
                type="button"
                className="timeline__bar"
                data-testid="timeline-bar"
                style={{ gridColumn: `${b.offset + 1} / span ${b.span}` }}
                onClick={() => history.push(`/tasks/${b.task.id}`)}
              >
                {b.task.title}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
