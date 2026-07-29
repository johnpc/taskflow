import { IonContent, IonPage } from '@ionic/react';
import { Link, Redirect } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './welcome.css';

/** Signed-out landing surface — the product hero + the two auth CTAs. An already
 * authenticated visitor is bounced straight to their projects. */
export function Welcome() {
  const { status } = useAuth();
  useDocumentTitle('Taskflow');

  if (status === 'authenticated') return <Redirect to="/home" />;

  return (
    <IonPage>
      <IonContent fullscreen className="welcome">
        <div className="welcome__body">
          <span className="welcome__mark" aria-hidden="true">
            🗂️
          </span>
          <h1 className="welcome__title tf-heading">Taskflow</h1>
          <p className="welcome__lede">
            A fast, focused home for your projects and tasks. Plan on a board, work through a list,
            and always know what’s next.
          </p>
          <div className="welcome__actions">
            <Link className="welcome__cta" to="/signup" data-testid="welcome-signup">
              Get started — it’s free
            </Link>
            <Link className="welcome__alt" to="/signin" data-testid="welcome-signin">
              I already have an account
            </Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
