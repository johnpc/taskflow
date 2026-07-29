import { IonIcon } from '@ionic/react';
import { squareOutline, checkboxOutline } from 'ionicons/icons';
import { parseNotes, type Inline } from './parseNotes';
import './taskDetail.css';

function renderInline(spans: Inline[]) {
  return spans.map((s, i) => {
    if (s.kind === 'bold') return <strong key={i}>{s.text}</strong>;
    if (s.kind === 'link')
      return (
        <a key={i} href={s.href} target="_blank" rel="noopener noreferrer">
          {s.text}
        </a>
      );
    return <span key={i}>{s.text}</span>;
  });
}

/** Read-only rendered preview of a task's notes: **bold**, safe [links](url),
 * and "[ ]/[x]" checklist lines. Renders nothing when notes are empty. */
export function NotesPreview({ notes }: { notes: string | null | undefined }) {
  const lines = parseNotes(notes).filter((l) => l.content.length > 0);
  if (lines.length === 0) return null;
  return (
    <div className="notes-preview" data-testid="notes-preview">
      {lines.map((line, i) =>
        line.kind === 'check' ? (
          <p key={i} className="notes-preview__check" data-testid="notes-check">
            <IonIcon icon={line.checked ? checkboxOutline : squareOutline} aria-hidden="true" />
            <span className={line.checked ? 'notes-preview__done' : ''}>
              {renderInline(line.content)}
            </span>
          </p>
        ) : (
          <p key={i} className="notes-preview__line">
            {renderInline(line.content)}
          </p>
        ),
      )}
    </div>
  );
}
