import { useDisplayName } from './useDisplayName';

/** Editable display-name field on the You tab. Shows the current name (or a
 * placeholder), commits on the Save button. Members see this name instead of
 * your email wherever your assignments/collaboration appear. */
export function DisplayNameField() {
  const { draft, setDraft, save, saved } = useDisplayName();
  const dirty = draft.trim() !== (saved ?? '');
  return (
    <div className="display-name" data-testid="display-name">
      <input
        className="display-name__input"
        data-testid="display-name-input"
        placeholder="Add a display name"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <button
        type="button"
        className="display-name__save"
        data-testid="display-name-save"
        disabled={!dirty || !draft.trim() || save.isPending}
        onClick={() => save.mutate(draft)}
      >
        {save.isPending ? 'Saving…' : 'Save'}
      </button>
      {save.isSuccess && !dirty && (
        <span className="display-name__ok" data-testid="display-name-ok">
          Saved
        </span>
      )}
    </div>
  );
}
