import { useHistory } from 'react-router-dom';
import type { HomeSummary } from './homeSummary';
import './home.css';

/** The two headline stats on the home dashboard: today's count and overdue.
 * Tapping either jumps to My Tasks. (The "Coming up" list is rendered
 * separately by UpcomingTasks.) */
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
    </div>
  );
}
