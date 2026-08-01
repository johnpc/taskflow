import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusUpdates } from './StatusUpdates';
import type { StatusUpdateRecord } from '../../lib/dataClient';

const update = (over: Partial<StatusUpdateRecord>): StatusUpdateRecord =>
  ({
    id: 'u',
    status: 'ON_TRACK',
    note: null,
    authorEmail: 'a@b.co',
    ...over,
  }) as StatusUpdateRecord;

describe('StatusUpdates', () => {
  it('renders the feed of past updates', () => {
    render(
      <StatusUpdates
        updates={[update({ id: 'u1', status: 'AT_RISK', note: 'Watch the timeline' })]}
        busy={false}
        nowMs={0}
        onPost={vi.fn()}
      />,
    );
    expect(screen.getByTestId('status-update')).toHaveTextContent('Watch the timeline');
  });

  it('disables Post until a status is chosen, then posts', () => {
    const onPost = vi.fn();
    render(<StatusUpdates updates={[]} busy={false} nowMs={0} onPost={onPost} />);
    expect(screen.getByTestId('status-update-post')).toBeDisabled();
    fireEvent.click(screen.getByTestId('status-post-OFF_TRACK'));
    fireEvent.change(screen.getByTestId('status-update-note'), { target: { value: 'Blocked' } });
    fireEvent.click(screen.getByTestId('status-update-post'));
    expect(onPost).toHaveBeenCalledWith({ status: 'OFF_TRACK', note: 'Blocked' });
  });

  it('toggling the active status off re-disables Post', () => {
    render(<StatusUpdates updates={[]} busy={false} nowMs={0} onPost={vi.fn()} />);
    fireEvent.click(screen.getByTestId('status-post-ON_TRACK'));
    expect(screen.getByTestId('status-update-post')).not.toBeDisabled();
    fireEvent.click(screen.getByTestId('status-post-ON_TRACK'));
    expect(screen.getByTestId('status-update-post')).toBeDisabled();
  });
});
