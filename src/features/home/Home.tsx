import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useHome } from './useHome';
import { greeting } from './greeting';
import { HomeSummaryCards } from './HomeSummaryCards';
import { LoadState } from '../shell/LoadState';
import { TabBar } from '../shell/TabBar';
import { useAuth } from '../auth/useAuth';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './home.css';

/** Home dashboard — the signed-in landing surface: a greeting, today/overdue
 * stats, what's coming up, and quick links into recent projects. Renders only. */
export function Home() {
  useDocumentTitle('Home');
  const { email } = useAuth();
  const { tasks, projects, summary } = useHome();
  const name = (email ?? '').split('@')[0];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1 className="tf-heading home__greeting" data-testid="home-greeting">
          {greeting(new Date().getHours())}
          {name ? `, ${name}` : ''}
        </h1>
        <LoadState isLoading={tasks.isLoading} isError={tasks.isError} onRetry={tasks.refetch}>
          <HomeSummaryCards summary={summary} />
        </LoadState>
        <section className="home__projects">
          <h2 className="home__section-head">Your projects</h2>
          <div className="home__project-links">
            {(projects.data ?? []).slice(0, 6).map((p) => (
              <Link key={p.id} className="home__project-link" to={`/projects/${p.id}`}>
                {p.name}
              </Link>
            ))}
          </div>
        </section>
        <TabBar active="Home" />
      </IonContent>
    </IonPage>
  );
}
