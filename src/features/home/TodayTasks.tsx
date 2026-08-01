import { useHistory } from 'react-router-dom';
import type { TaskRecord } from '../../lib/dataClient';

/** Home "Due today" list: the open tasks due today, each opening on tap. Renders
 * nothing when nothing is due today (the summary cards still show the 0). */
export function TodayTasks({ tasks }: { tasks: TaskRecord[] }) {
  const history = useHistory();
  if (tasks.length === 0) return null;
  return (
    <section className="home__today" data-testid="home-today">
      <h2 className="home__section-head">Due today</h2>
      <ul className="home__upcoming-list">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              className="home__upcoming-item"
              data-testid="home-today-item"
              onClick={() => history.push(`/tasks/${t.id}`)}
            >
              <span className="home__upcoming-title">{t.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
