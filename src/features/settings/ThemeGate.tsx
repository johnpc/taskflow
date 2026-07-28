import { type ReactNode } from 'react';
import { useTheme } from './useTheme';

/** Applies the persisted theme preference to <html> for the whole app. Renders
 * its children unchanged — it exists only to run the useTheme effect once at the
 * root, so a returning user's Light/Dark/System choice takes effect on load. */
export function ThemeGate({ children }: { children: ReactNode }) {
  useTheme();
  return <>{children}</>;
}
