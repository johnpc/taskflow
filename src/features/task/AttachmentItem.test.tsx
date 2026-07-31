import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { attachmentFileUrl } = vi.hoisted(() => ({ attachmentFileUrl: vi.fn() }));
vi.mock('./attachmentFileApi', () => ({ attachmentFileUrl }));

import { hookWrapper } from '../../test/hookWrapper';
import { AttachmentItem } from './AttachmentItem';
import type { AttachmentRecord } from '../../lib/dataClient';

const att = (over: Partial<AttachmentRecord>): AttachmentRecord =>
  ({ id: 'a', taskId: 't', url: 'https://x.co', title: null, ...over }) as AttachmentRecord;

beforeEach(() => attachmentFileUrl.mockReset());

describe('AttachmentItem', () => {
  it('renders a safe link and removes it', () => {
    const onRemove = vi.fn();
    render(
      <AttachmentItem
        attachment={att({ url: 'https://spec.example', title: 'Spec' })}
        onRemove={onRemove}
      />,
      {
        wrapper: hookWrapper(),
      },
    );
    expect(screen.getByRole('link', { name: 'Spec' })).toHaveAttribute(
      'href',
      'https://spec.example',
    );
    fireEvent.click(screen.getByTestId('attachment-remove'));
    expect(onRemove).toHaveBeenCalledWith('a');
  });

  it('renders an unsafe url as struck-through, not a link', () => {
    render(
      <AttachmentItem
        attachment={att({ url: 'javascript:alert(1)', title: 'evil' })}
        onRemove={vi.fn()}
      />,
      {
        wrapper: hookWrapper(),
      },
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('evil')).toHaveClass('attachment__link--bad');
  });

  it('resolves an uploaded file to a signed download link', async () => {
    attachmentFileUrl.mockResolvedValue('https://s3/file');
    render(
      <AttachmentItem
        attachment={att({
          url: 'file:attachments/t/x.pdf',
          storageKey: 'attachments/t/x.pdf',
          title: 'x.pdf',
        })}
        onRemove={vi.fn()}
      />,
      { wrapper: hookWrapper() },
    );
    const link = await screen.findByRole('link');
    expect(link).toHaveAttribute('href', 'https://s3/file');
    expect(link).toHaveTextContent('x.pdf');
  });
});
