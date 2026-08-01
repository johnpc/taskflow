import { useHistory } from 'react-router-dom';
import { horizonDates } from '../calendar/horizon';
import { todayISO } from '../task/today';
import { timelineLayout } from './timelineLayout';
import { useTimelineDrag } from './useTimelineDrag';
import { TimelineHead } from './TimelineHead';
import { prioClass } from './timelineBarClass';
import type { Column } from '../board/taskGrouping';
import './timeline.css';

const DAYS = 14;

type RescheduleFn = (patch: { id: string; dueDate: string; startDate?: string }) => void;

/** Timeline (Gantt) view: a two-week horizontal axis with a day-header row and
 * one bar per open dated task, positioned start→due. Bars open the task on
 * click and can be dragged onto a day to reschedule. Reads the board's columns
 * (flattened); no server round-trip. */
export function TimelineView({
  columns,
  onReschedule,
}: {
  columns: Column[];
  onReschedule?: RescheduleFn;
}) {
  const history = useHistory();
  const start = todayISO();
  const days = horizonDates(start, DAYS);
  const bars = timelineLayout(
    columns.flatMap((c) => c.tasks),
    start,
    DAYS,
  );
  const drag = useTimelineDrag(bars, onReschedule);
  const cols = { gridTemplateColumns: `repeat(${DAYS}, minmax(28px, 1fr))` };

  return (
    <div className="timeline" data-testid="timeline-view">
      <TimelineHead days={days} today={start} cols={cols} onDropOnDay={drag.onDropOnDay} />
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
                className={`timeline__bar${prioClass(b.task.priority)}`}
                data-testid="timeline-bar"
                draggable={!!onReschedule}
                style={{ gridColumn: `${b.offset + 1} / span ${b.span}` }}
                onDragStart={() => drag.onStart(b.task.id)}
                onDragEnd={drag.onEnd}
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
