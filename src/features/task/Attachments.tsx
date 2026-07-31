import { useRef, useState } from 'react';
import { safeHref } from './safeHref';
import { AttachmentItem } from './AttachmentItem';
import type { AttachmentRecord } from '../../lib/dataClient';

/** Task-detail attachments: a list of link + uploaded-file chips, each with a
 * remove button, plus an add form (title + url link) and a file-upload button.
 * A url that fails the safeHref guard is rejected on add. Delegates up. */
export function Attachments({
  attachments,
  busy,
  onAdd,
  onAddFile,
  onRemove,
}: {
  attachments: AttachmentRecord[];
  busy: boolean;
  onAdd: (input: { url: string; title: string }) => void;
  onAddFile: (file: File) => void;
  onRemove: (id: string) => void;
}) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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
        {attachments.map((a) => (
          <AttachmentItem key={a.id} attachment={a} onRemove={onRemove} />
        ))}
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
        <button
          type="button"
          className="attachments__upload"
          data-testid="attachment-upload"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          Upload file
        </button>
        <input
          ref={fileRef}
          type="file"
          className="attachments__file"
          data-testid="attachment-file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onAddFile(file);
          }}
        />
      </div>
    </section>
  );
}
