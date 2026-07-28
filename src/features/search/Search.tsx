import { IonContent, IonHeader, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useSearch } from './useSearch';
import { EmptyState } from '../shell/EmptyState';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import { searchOutline } from 'ionicons/icons';
import './search.css';

/** Search tab — live substring search across all the owner's tasks. Empty query
 * shows a prompt; a query with no hits shows a distinct "no results". Renders. */
export function Search() {
  useDocumentTitle('Search');
  const history = useHistory();
  const { query, setQuery, results } = useSearch();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          data-testid="search-input"
          value={query}
          debounce={150}
          placeholder="Search tasks"
          onIonInput={(e) => setQuery(e.detail.value ?? '')}
        />
        {query.trim() === '' ? (
          <EmptyState
            icon={searchOutline}
            title="Find any task"
            message="Search by title or notes across all your projects."
            testId="search-prompt"
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={searchOutline}
            title="No matches"
            message={`Nothing matches “${query.trim()}”.`}
            testId="search-empty"
          />
        ) : (
          <ul className="search__results" data-testid="search-results">
            {results.map((task) => (
              <li key={task.id}>
                <button
                  type="button"
                  className="search__hit"
                  data-testid="search-hit"
                  onClick={() => history.push(`/tasks/${task.id}`)}
                >
                  {task.title}
                </button>
              </li>
            ))}
          </ul>
        )}
        <TabBar active="Search" />
      </IonContent>
    </IonPage>
  );
}
