import { useHistory } from 'react-router-dom';
import type { MonthCell } from './monthGrid';

interface CellDrag {
  onStart: (id: string, from: string) => void;
  onEnd: () => void;
  onDropOnDay: (date: string) => void;
}

/** One day cell in the month grid: the day number plus up-to-three task chips
 * (a "+N" more marker beyond that), each opening the task. Chips are draggable
 * and the cell is a drop target so a task can be rescheduled onto another day.
 * Spill-over days from adjacent months are dimmed; today is highlighted. */
export function CalendarCell({ cell, drag }: { cell: MonthCell; drag?: CellDrag }) {
  const history = useHistory();
  const shown = cell.tasks.slice(0, 3);
  const extra = cell.tasks.length - shown.length;
  const cls = [
    'calendar-cell',
    cell.inMonth ? '' : 'calendar-cell--muted',
    cell.isToday ? 'calendar-cell--today' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      data-testid={`cell-${cell.date}`}
      onDragOver={drag && ((e) => e.preventDefault())}
      onDrop={drag && (() => drag.onDropOnDay(cell.date))}
    >
      <span className="calendar-cell__day">{cell.day}</span>
      {shown.map((task) => (
        <button
          key={task.id}
          type="button"
          className="calendar-cell__chip"
          data-testid="calendar-task"
          title={task.title ?? ''}
          draggable={!!drag}
          onDragStart={drag && (() => drag.onStart(task.id, cell.date))}
          onDragEnd={drag && drag.onEnd}
          onClick={() => history.push(`/tasks/${task.id}`)}
        >
          {task.title}
        </button>
      ))}
      {extra > 0 && <span className="calendar-cell__more">+{extra} more</span>}
    </div>
  );
}
