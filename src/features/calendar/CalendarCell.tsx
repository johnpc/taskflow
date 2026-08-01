import { useHistory } from 'react-router-dom';
import type { MonthCell } from './monthGrid';

/** One day cell in the month grid: the day number plus up-to-three task chips
 * (a "+N" more marker beyond that), each opening the task. Spill-over days from
 * adjacent months are dimmed; today is highlighted. Renders only. */
export function CalendarCell({ cell }: { cell: MonthCell }) {
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
    <div className={cls} data-testid={`cell-${cell.date}`}>
      <span className="calendar-cell__day">{cell.day}</span>
      {shown.map((task) => (
        <button
          key={task.id}
          type="button"
          className="calendar-cell__chip"
          data-testid="calendar-task"
          title={task.title ?? ''}
          onClick={() => history.push(`/tasks/${task.id}`)}
        >
          {task.title}
        </button>
      ))}
      {extra > 0 && <span className="calendar-cell__more">+{extra} more</span>}
    </div>
  );
}
