import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import './errorBoundary.css';

/** 404 screen for any unmatched route — a friendly dead-end back to projects,
 * so a mistyped/stale URL never renders a blank page. */
export function NotFound() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="error-fallback" data-testid="not-found">
          <span className="error-fallback__emoji" aria-hidden="true">
            🧭
          </span>
          <h2 className="tf-heading error-fallback__title">Nothing here</h2>
          <p className="tf-muted">That page doesn’t exist. Let’s get you back to your work.</p>
          <Link className="error-fallback__reload" to="/projects" data-testid="not-found-home">
            Back to projects
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
}
