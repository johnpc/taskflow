import { type ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { SkeletonRows } from '../shell/SkeletonRows';
import { useAuth } from './useAuth';

/** Route guard for Taskflow's account-based screens. While the Cognito session
 * is resolving, shows a skeleton (never a redirect race); once resolved, an
 * unauthenticated visitor is sent to the welcome screen and an authenticated
 * one sees the protected content. Every workspace route wraps in this. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <SkeletonRows />
        </IonContent>
      </IonPage>
    );
  }
  if (status === 'unauthenticated') return <Redirect to="/welcome" />;
  return <>{children}</>;
}
