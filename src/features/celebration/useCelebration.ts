import { useContext } from 'react';
import { CelebrationContext } from './CelebrationContext';

/** Access the celebration API (`celebrate`). Returns a no-op outside a provider
 * so completing a task never throws just because celebration isn't mounted. */
export function useCelebration(): { celebrate: () => void } {
  return useContext(CelebrationContext) ?? { celebrate: () => {} };
}
