import { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { bookmarkOutline, closeOutline } from 'ionicons/icons';
import type { SavedView } from './savedViewsStore';

/** Saved-views bar: a chip per saved view (tap to apply, ✕ to delete) plus a
 * "Save view" affordance that reveals an inline name input. Presentational —
 * apply/save/delete are delegated to the caller (useSavedViews + the filter). */
export function SavedViews({
  views,
  onApply,
  onSave,
  onDelete,
}: {
  views: SavedView[];
  onApply: (view: SavedView) => void;
  onSave: (name: string) => void;
  onDelete: (name: string) => void;
}) {
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState('');

  const commit = () => {
    if (name.trim()) onSave(name);
    setName('');
    setNaming(false);
  };

  return (
    <div className="saved-views" data-testid="saved-views">
      {views.map((v) => (
        <span key={v.name} className="saved-views__chip" data-testid="saved-view">
          <button type="button" className="saved-views__apply" onClick={() => onApply(v)}>
            {v.name}
          </button>
          <button
            type="button"
            className="saved-views__del"
            data-testid="saved-view-delete"
            aria-label={`Delete view ${v.name}`}
            onClick={() => onDelete(v.name)}
          >
            <IonIcon icon={closeOutline} />
          </button>
        </span>
      ))}
      {naming ? (
        <input
          className="saved-views__input"
          data-testid="saved-view-name"
          placeholder="View name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
        />
      ) : (
        <button
          type="button"
          className="saved-views__save"
          data-testid="saved-view-save"
          onClick={() => setNaming(true)}
        >
          <IonIcon icon={bookmarkOutline} aria-hidden="true" />
          Save view
        </button>
      )}
    </div>
  );
}
