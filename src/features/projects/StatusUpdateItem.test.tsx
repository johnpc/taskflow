import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusUpdateItem } from './StatusUpdateItem';
import type { StatusUpdateRecord } from '../../lib/dataClient';

const update = (over: Partial<StatusUpdateRecord>): StatusUpdateRecord =>
  ({
    id: 'u',
    status: 'ON_TRACK',
    note: null,
    authorEmail: 'a@b.co',
    ...over,
  }) as StatusUpdateRecord;

describe('StatusUpdateItem', () => {
  it('shows the pill, author, relative time, and note', () => {
    const now = Date.parse('2026-07-29T12:00:00Z');
    render(
      <StatusUpdateItem
        update={update({
          status: 'AT_RISK',
          note: 'Timeline slipping',
          createdAt: '2026-07-29T11:58:00Z',
        })}
        nowMs={now}
      />,
    );
    expect(screen.getByTestId('status-pill')).toHaveTextContent('At risk');
    expect(screen.getByTestId('status-update')).toHaveTextContent('a@b.co');
    expect(screen.getByTestId('status-update')).toHaveTextContent('2m ago');
    expect(screen.getByTestId('status-update')).toHaveTextContent('Timeline slipping');
  });

  it('omits the note paragraph when there is none', () => {
    render(<StatusUpdateItem update={update({ note: null })} nowMs={0} />);
    expect(screen.getByTestId('status-update').querySelector('.status-update__note')).toBeNull();
  });
});
