import { useState } from 'react';
import { safeHref } from './safeHref';
import type { AttachmentRecord } from '../../lib/dataClient';

/** Task-detail attachments: a list of link chips (title or url, safeHref-guarded)
 * each with a remove button, plus an add form (title + url). A url that fails
 * the safeHref guard is rejected on add. Delegates add/remove to the parent. */
export function Attachments({
  attachments,
  busy,
  onAdd,
  onRemove,
}: {
  attachments: AttachmentRecord[];
  busy: boolean;
  onAdd: (input: { url: string; title: string }) => void;
  onRemove: (id: string) => void;
}) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const submit = () => {
    if (!safeHref(url)) return;
    onAdd({ url, title });
    setUrl('');
    setTitle('');
  };

  return (
    <section className="attachments" data-testid="attachments">
      <h2 className="subtasks__head">Attachments</h2>
      <ul className="attachments__list">
        {attachments.map((a) => {
          const href = safeHref(a.url);
          return (
            <li key={a.id} className="attachment" data-testid="attachment">
              {href ? (
                <a
                  className="attachment__link"
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {a.title || a.url}
                </a>
              ) : (
                <span className="attachment__link attachment__link--bad">{a.title || a.url}</span>
              )}
              <button
                type="button"
                className="attachment__remove"
                data-testid="attachment-remove"
                aria-label={`Remove ${a.title || a.url}`}
                onClick={() => onRemove(a.id)}
              >
                ✕
              </button>
            </li>
          );
        })}
      </ul>
      <div className="attachments__composer">
        <input
          className="attachments__input"
          data-testid="attachment-title"
          placeholder="Label (optional)"
          value={title}
          disabled={busy}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="attachments__input"
          data-testid="attachment-url"
          placeholder="https://…"
          value={url}
          disabled={busy}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          className="attachments__add"
          data-testid="attachment-add"
          disabled={busy || !safeHref(url)}
          onClick={submit}
        >
          Attach
        </button>
      </div>
    </section>
  );
}
