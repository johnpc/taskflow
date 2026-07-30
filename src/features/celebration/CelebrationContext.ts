import { createContext } from 'react';

export interface CelebrationContextValue {
  /** Call when a task is completed; fires the confetti intermittently. */
  celebrate: () => void;
}

/** Celebration context; consumed via useCelebration. Null until a provider
 * mounts (a no-op fallback keeps completion working outside the provider). */
export const CelebrationContext = createContext<CelebrationContextValue | null>(null);
