import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ThemeToggle } from '../settings/ThemeToggle';
import { ChangePassword } from './ChangePassword';
import { DisplayNameField } from './DisplayNameField';
import { AvatarUpload } from './AvatarUpload';
import { TabBar } from '../shell/TabBar';
import { useDocumentTitle } from '../shell/useDocumentTitle';
import './profile.css';

/** You tab — the signed-in account, appearance settings, and sign-out. */
export function Profile() {
  useDocumentTitle('You');
  const { email, signOut } = useAuth();
  const history = useHistory();

  const handleSignOut = async () => {
    await signOut();
    history.replace('/welcome');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>You</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="profile" data-testid="profile">
          <AvatarUpload fallback={(email ?? '?').charAt(0).toUpperCase()} />
          <p className="profile__email tf-heading" data-testid="profile-email">
            {email ?? 'Signed in'}
          </p>

          <section className="profile__section">
            <h2 className="profile__section-head">Display name</h2>
            <DisplayNameField />
          </section>

          <section className="profile__section">
            <h2 className="profile__section-head">Appearance</h2>
            <ThemeToggle />
          </section>

          <section className="profile__section">
            <h2 className="profile__section-head">Security</h2>
            <ChangePassword />
          </section>

          <section className="profile__section">
            <h2 className="profile__section-head">Install</h2>
            <p className="tf-muted profile__hint">
              Add Taskflow to your home screen from your browser’s share menu for a full-screen,
              offline-ready app.
            </p>
          </section>

          <button
            type="button"
            className="profile__signout"
            data-testid="sign-out"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
        <TabBar active="You" />
      </IonContent>
    </IonPage>
  );
}
