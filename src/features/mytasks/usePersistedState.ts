import { useState } from 'react';

/** useState seeded from a persisted reader, whose setter also writes through to
 * the store. Collapses the repeated read/write/setter boilerplate behind each
 * My Tasks preference (group mode, show-completed, assigned-only, …). */
export function usePersistedState<T>(read: () => T, write: (v: T) => void) {
  const [value, setValue] = useState<T>(read);
  const set = (next: T) => {
    write(next);
    setValue(next);
  };
  return [value, set] as const;
}
