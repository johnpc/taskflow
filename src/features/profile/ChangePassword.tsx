import { useChangePassword } from './useChangePassword';

/** A "change password" form on the You tab: current + new password, with inline
 * success/error feedback. Logic lives in useChangePassword; this renders + wires
 * the inputs and clears on success. */
export function ChangePassword() {
  const { current, setCurrent, next, setNext, status, submit } = useChangePassword();
  return (
    <div className="change-password" data-testid="change-password">
      <input
        type="password"
        className="change-password__input"
        data-testid="cp-current"
        placeholder="Current password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <input
        type="password"
        className="change-password__input"
        data-testid="cp-new"
        placeholder="New password (min 8 chars)"
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />
      <button
        type="button"
        className="change-password__save"
        data-testid="cp-save"
        disabled={status === 'saving'}
        onClick={submit}
      >
        {status === 'saving' ? 'Saving…' : 'Update password'}
      </button>
      {status === 'done' && (
        <p className="change-password__msg change-password__msg--ok" data-testid="cp-done">
          Password updated.
        </p>
      )}
      {status === 'error' && (
        <p className="change-password__msg change-password__msg--err" data-testid="cp-error">
          Couldn’t update — check your current password (new must be 8+ chars).
        </p>
      )}
    </div>
  );
}
