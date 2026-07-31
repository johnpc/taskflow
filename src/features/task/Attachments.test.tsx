import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// AttachmentItem self-fetches file URLs (react-query) + is tested on its own —
// stub it to a simple link/label row so Attachments stays a bare render.
vi.mock('./AttachmentItem', () => ({
  AttachmentItem: ({
    attachment,
    onRemove,
  }: {
    attachment: { id: string; url: string; title: string | null };
    onRemove: (id: string) => void;
  }) => (
    <li data-testid="attachment">
      {attachment.url.startsWith('javascript:') ? (
        <span className="attachment__link--bad">{attachment.title}</span>
      ) : (
        <a href={attachment.url}>{attachment.title}</a>
      )}
      <button data-testid="attachment-remove" onClick={() => onRemove(attachment.id)}>
        ✕
      </button>
    </li>
  ),
}));

import { Attachments } from './Attachments';
import type { AttachmentRecord } from '../../lib/dataClient';

const att = (over: Partial<AttachmentRecord>): AttachmentRecord =>
  ({ id: 'a', taskId: 't', url: 'https://x.co', title: null, ...over }) as AttachmentRecord;

const render_ = (props: Partial<Parameters<typeof Attachments>[0]>) =>
  render(
    <Attachments
      attachments={props.attachments ?? []}
      busy={props.busy ?? false}
      onAdd={props.onAdd ?? vi.fn()}
      onAddFile={props.onAddFile ?? vi.fn()}
      onRemove={props.onRemove ?? vi.fn()}
    />,
  );

describe('Attachments', () => {
  it('renders an attachment with a remove button', () => {
    const onRemove = vi.fn();
    render_({
      attachments: [att({ id: 'a1', url: 'https://spec.example', title: 'Spec' })],
      onRemove,
    });
    fireEvent.click(screen.getByTestId('attachment-remove'));
    expect(onRemove).toHaveBeenCalledWith('a1');
  });

  it('adds a link and disables the Attach button for an unsafe url', () => {
    const onAdd = vi.fn();
    render_({ onAdd });
    const add = screen.getByTestId('attachment-add');
    expect(add).toBeDisabled();
    fireEvent.change(screen.getByTestId('attachment-url'), {
      target: { value: 'https://ok.example' },
    });
    fireEvent.change(screen.getByTestId('attachment-title'), { target: { value: 'Doc' } });
    expect(add).not.toBeDisabled();
    fireEvent.click(add);
    expect(onAdd).toHaveBeenCalledWith({ url: 'https://ok.example', title: 'Doc' });
  });

  it('uploads a picked file', () => {
    const onAddFile = vi.fn();
    render_({ onAddFile });
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('attachment-file'), { target: { files: [file] } });
    expect(onAddFile).toHaveBeenCalledWith(file);
  });
});
