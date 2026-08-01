import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useCalendar } from './useCalendar';
import { CalendarTask } from './CalendarTask';
import { useProjectsById } from '../projects/useProjectsById';
import { LoadState } from '../shell/LoadState';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './calendar.css';

/** Calendar tab — the owner's dated, open tasks over the next two weeks, grouped
 * by day. A forward-looking companion to My Tasks. Renders only. */
export function Calendar() {
  useDocumentTitle('Calendar');
  const history = useHistory();
  const { query, days, atStart, prevWeek, nextWeek, goToday } = useCalendar();
  const projectsById = useProjectsById();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="calendar__nav">
          <h1 className="tf-heading calendar__title">Two weeks</h1>
          <span className="calendar__nav-controls">
            <button
              type="button"
              className="calendar__nav-btn"
              data-testid="calendar-prev"
              aria-label="Previous week"
              disabled={atStart}
              onClick={prevWeek}
            >
              ‹
            </button>
            <button
              type="button"
              className="calendar__nav-btn"
              data-testid="calendar-today"
              onClick={goToday}
            >
              Today
            </button>
            <button
              type="button"
              className="calendar__nav-btn"
              data-testid="calendar-next"
              aria-label="Next week"
              onClick={nextWeek}
            >
              ›
            </button>
          </span>
        </div>
        <LoadState
          isLoading={query.isLoading}
          isError={query.isError}
          isEmpty={days.length === 0}
          onRetry={query.refetch}
          emptyTitle="Nothing scheduled"
          emptyMessage="Tasks with a due date in the next two weeks show up here."
        >
          <div className="calendar__days">
            {days.map((day) => (
              <section key={day.date} className="calendar__day" data-testid={`day-${day.date}`}>
                <h2 className="calendar__day-head">{day.label}</h2>
                <ul className="calendar__list">
                  {day.tasks.map((task) => (
                    <li key={task.id}>
                      <CalendarTask
                        title={task.title}
                        project={projectsById.get(task.projectId)}
                        assigneeEmail={task.assigneeEmail}
                        onOpen={() => history.push(`/tasks/${task.id}`)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </LoadState>
        <TabBar active="Calendar" />
      </IonContent>
    </IonPage>
  );
}
