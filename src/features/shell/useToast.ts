import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './ToastContext';

/** Access the toast API (showUndo). Must be used within a ToastProvider. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
