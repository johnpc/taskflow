import { useHistory } from 'react-router-dom';
import { dueLabelWithTime } from '../task/taskMeta';
import { todayISO } from '../task/today';
import type { TaskRecord } from '../../lib/dataClient';

/** Home "Coming up" list: the next few open, dated tasks with their due label.
 * Tapping one opens it. Renders nothing when there's nothing upcoming. */
export function UpcomingTasks({ tasks }: { tasks: TaskRecord[] }) {
  const history = useHistory();
  if (tasks.length === 0) return null;
  const today = todayISO();
  return (
    <section className="home__upcoming" data-testid="home-upcoming">
      <h2 className="home__section-head">Coming up</h2>
      <ul className="home__upcoming-list">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="home__upcoming-item"
              data-testid="home-upcoming-item"
              onClick={() => history.push(`/tasks/${t.id}`)}
            >
              <span className="home__upcoming-title">{t.title}</span>
              <span className="home__upcoming-due">
                {dueLabelWithTime(t.dueDate, t.dueTime, today)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
