import { useState } from 'react';
import { changePassword } from '../auth/authClient';

export type ChangePasswordStatus = 'idle' | 'saving' | 'done' | 'error';

/** Change-password form state + submit. Validates (new password ≥ 8 chars),
 * calls Cognito (which verifies the current password), and exposes a status for
 * inline feedback. Extracted as a hook so the submit promise can be awaited in
 * tests (the component just renders + wires inputs). */
export function useChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [status, setStatus] = useState<ChangePasswordStatus>('idle');

  const submit = async () => {
    if (!current || next.length < 8) return setStatus('error');
    setStatus('saving');
    const { ok } = await changePassword(current, next);
    if (!ok) return setStatus('error');
    setCurrent('');
    setNext('');
    setStatus('done');
  };

  return { current, setCurrent, next, setNext, status, submit };
}
