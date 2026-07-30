import { useCallback, useRef, useState, type ReactNode } from 'react';
import { CelebrationContext } from './CelebrationContext';
import { shouldCelebrate } from './shouldCelebrate';
import { Confetti } from './Confetti';

/** Provides `celebrate()` to the tree and renders a confetti burst when a
 * completion qualifies (intermittent — see shouldCelebrate). The burst
 * auto-clears after the animation so it's a one-shot treat. The running count
 * lives in a ref (celebrating shouldn't re-render the whole tree). */
export function CelebrationProvider({ children }: { children: ReactNode }) {
  const count = useRef(0);
  const [burst, setBurst] = useState(0); // bumped to remount the Confetti
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const celebrate = useCallback(() => {
    count.current += 1;
    if (!shouldCelebrate(count.current)) return;
    setBurst((b) => b + 1);
    setShow(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 2200);
  }, []);

  return (
    <CelebrationContext.Provider value={{ celebrate }}>
      {children}
      {show && <Confetti key={burst} />}
    </CelebrationContext.Provider>
  );
}
