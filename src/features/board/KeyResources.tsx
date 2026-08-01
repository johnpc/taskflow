import { useState } from 'react';
import { safeHref } from '../task/safeHref';
import type { ProjectResourceRecord } from '../../lib/dataClient';

/** Presentational key-resources list + add form for a project. Each row is a
 * safeHref-guarded link (opens in a new tab) with a remove button; the composer
 * rejects a url that fails the guard. Delegates add/remove up. */
export function KeyResources({
  resources,
  busy,
  onAdd,
  onRemove,
}: {
  resources: ProjectResourceRecord[];
  busy: boolean;
  onAdd: (input: { title: string; url: string }) => void;
  onRemove: (id: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const submit = () => {
    if (!title.trim() || !safeHref(url)) return;
    onAdd({ title, url });
    setTitle('');
    setUrl('');
  };

  return (
    <div className="key-resources__body">
      <ul className="key-resources__list">
        {resources.map((r) => {
          const href = safeHref(r.url);
          return (
            <li key={r.id} className="key-resources__item" data-testid="key-resource">
              {href ? (
                <a className="key-resources__link" href={href} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
              ) : (
                <span className="key-resources__link">{r.title}</span>
              )}
              <button
                type="button"
                className="key-resources__remove"
                data-testid="key-resource-remove"
                aria-label={`Remove ${r.title}`}
                onClick={() => onRemove(r.id)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
      <div className="key-resources__composer">
        <input
          className="key-resources__input"
          data-testid="key-resource-title"
          placeholder="Label"
          value={title}
          disabled={busy}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="key-resources__input"
          data-testid="key-resource-url"
          placeholder="https://…"
          value={url}
          disabled={busy}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          className="key-resources__add"
          data-testid="key-resource-add"
          disabled={busy || !title.trim() || !safeHref(url)}
          onClick={submit}
        >
          Add
        </button>
      </div>
    </div>
  );
}
