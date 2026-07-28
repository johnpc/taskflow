import { useCallback, useEffect, useState } from 'react';
import { applyThemePref, readThemePref, writeThemePref, type ThemePref } from './themeStore';

/** Theme preference state: reads the persisted choice on mount, applies it to
 * <html>, and exposes a setter that persists + re-applies. Consumed by Settings
 * and applied once at app startup. */
export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => readThemePref());

  useEffect(() => {
    applyThemePref(pref, document.documentElement);
  }, [pref]);

  const choose = useCallback((next: ThemePref) => {
    writeThemePref(next);
    setPref(next);
  }, []);

  return { pref, choose };
}
