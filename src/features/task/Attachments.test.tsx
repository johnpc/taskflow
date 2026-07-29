import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Attachments } from './Attachments';
import type { AttachmentRecord } from '../../lib/dataClient';

const att = (over: Partial<AttachmentRecord>): AttachmentRecord =>
  ({ id: 'a', taskId: 't', url: 'https://x.co', title: null, ...over }) as AttachmentRecord;

describe('Attachments', () => {
  it('renders a safe link with its title and a remove button', () => {
    const onRemove = vi.fn();
    render(
      <Attachments
        attachments={[att({ id: 'a1', url: 'https://spec.example', title: 'Spec' })]}
        busy={false}
        onAdd={vi.fn()}
        onRemove={onRemove}
      />,
    );
    const link = screen.getByRole('link', { name: 'Spec' });
    expect(link).toHaveAttribute('href', 'https://spec.example');
    fireEvent.click(screen.getByTestId('attachment-remove'));
    expect(onRemove).toHaveBeenCalledWith('a1');
  });

  it('renders an unsafe url as struck-through, not a link', () => {
    render(
      <Attachments
        attachments={[att({ url: 'javascript:alert(1)', title: 'evil' })]}
        busy={false}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('evil')).toHaveClass('attachment__link--bad');
  });

  it('adds a link and disables the button for an unsafe url', () => {
    const onAdd = vi.fn();
    render(<Attachments attachments={[]} busy={false} onAdd={onAdd} onRemove={vi.fn()} />);
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
});
