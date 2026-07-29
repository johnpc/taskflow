import { useHistory } from 'react-router-dom';
import type { HomeSummary } from './homeSummary';
import './home.css';

/** The three headline stats on the home dashboard: today's count, overdue, and
 * the upcoming list. Tapping today/overdue jumps to My Tasks; a task opens it. */
export function HomeSummaryCards({ summary }: { summary: HomeSummary }) {
  const history = useHistory();
  return (
    <div className="home__cards">
      <div className="home__stats">
        <button
          type="button"
          className="home__stat"
          data-testid="home-today"
          onClick={() => history.push('/my-tasks')}
        >
          <span className="home__stat-num">{summary.today.length}</span>
          <span className="home__stat-label">Due today</span>
        </button>
        <button
          type="button"
          className={summary.overdue > 0 ? 'home__stat home__stat--alert' : 'home__stat'}
          data-testid="home-overdue"
          onClick={() => history.push('/my-tasks')}
        >
          <span className="home__stat-num">{summary.overdue}</span>
          <span className="home__stat-label">Overdue</span>
        </button>
      </div>
      {summary.upcoming.length > 0 && (
        <section className="home__upcoming" data-testid="home-upcoming">
          <h2 className="home__section-head">Coming up</h2>
          <ul className="home__list">
            {summary.upcoming.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  className="home__task"
                  data-testid="home-task"
                  onClick={() => history.push(`/tasks/${task.id}`)}
                >
                  {task.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
