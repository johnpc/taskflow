import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type UndoToast } from './ToastContext';
import './toast.css';

const DISMISS_MS = 6000;

/** Renders a single transient undo toast and provides showUndo to the tree. A
 * new toast replaces any current one; it auto-dismisses after DISMISS_MS. The
 * timer is injectable-free but cleared on unmount / replace. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<UndoToast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showUndo = useCallback((next: UndoToast) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(next);
    timer.current = setTimeout(() => setToast(null), DISMISS_MS);
  }, []);

  useEffect(() => () => clear(), [clear]);

  return (
    <ToastContext.Provider value={{ showUndo }}>
      {children}
      {toast && (
        <div className="toast" role="status" data-testid="undo-toast">
          <span className="toast__msg">{toast.message}</span>
          <button
            type="button"
            className="toast__undo"
            data-testid="undo-toast-action"
            onClick={() => {
              toast.onUndo();
              clear();
            }}
          >
            Undo
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
