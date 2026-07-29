import { IonApp, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './features/auth/AuthProvider';
import { ThemeGate } from './features/settings/ThemeGate';
import { ToastProvider } from './features/shell/ToastProvider';
import { ErrorBoundary } from './features/shell/ErrorBoundary';
import { AppRoutes } from './AppRoutes';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Brand fonts (bundled) + design tokens (own light/dark, so no Ionic palette) */
import './theme/fonts';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <QueryClientProvider client={queryClient}>
      <ThemeGate>
        <AuthProvider>
          <ToastProvider>
            <IonReactRouter>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </IonReactRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeGate>
    </QueryClientProvider>
  </IonApp>
);

export default App;
