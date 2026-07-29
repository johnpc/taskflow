import { createContext } from 'react';

export interface UndoToast {
  message: string;
  onUndo: () => void;
}

export interface ToastContextValue {
  /** Show a transient toast with an Undo action; auto-dismisses after a few s. */
  showUndo: (toast: UndoToast) => void;
}

/** Toast context; consumed via useToast. Null until a provider mounts. */
export const ToastContext = createContext<ToastContextValue | null>(null);
