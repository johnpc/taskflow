import { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { CalendarList } from './CalendarList';
import { CalendarMonth } from './CalendarMonth';
import { readCalendarView, writeCalendarView, type CalendarView } from './calendarViewStore';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './calendar.css';

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: 'LIST', label: 'Two weeks' },
  { key: 'MONTH', label: 'Month' },
];

/** Calendar tab — the owner's dated, open tasks, as either a two-week day list
 * or a month grid. A forward-looking companion to My Tasks. Renders only. */
export function Calendar() {
  useDocumentTitle('Calendar');
  const [view, setView] = useState<CalendarView>(() => readCalendarView());
  const choose = (next: CalendarView) => {
    setView(next);
    writeCalendarView(next);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="view-toggle calendar__view-toggle">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              className={`view-toggle__seg ${view === v.key ? 'view-toggle__seg--on' : ''}`}
              data-testid={`calendar-view-${v.key.toLowerCase()}`}
              aria-pressed={view === v.key}
              onClick={() => choose(v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>
        {view === 'MONTH' ? <CalendarMonth /> : <CalendarList />}
        <TabBar active="Calendar" />
      </IonContent>
    </IonPage>
  );
}
