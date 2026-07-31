import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const { fetchTaskEvents } = vi.hoisted(() => ({ fetchTaskEvents: vi.fn() }));
vi.mock('./taskEventsApi', () => ({ fetchTaskEvents }));

import { hookWrapper } from '../../test/hookWrapper';
import { ActivityFeed } from './ActivityFeed';

beforeEach(() => fetchTaskEvents.mockReset());

describe('ActivityFeed', () => {
  it('renders nothing when there are no events', async () => {
    fetchTaskEvents.mockResolvedValue([]);
    const { container } = render(<ActivityFeed taskId="t1" nowMs={Date.now()} />, {
      wrapper: hookWrapper(),
    });
    // Query resolves to empty → nothing rendered.
    expect(container.querySelector('[data-testid="activity-feed"]')).toBeNull();
  });

  it('lists events with who + action', async () => {
    fetchTaskEvents.mockResolvedValue([
      { id: 'a', kind: 'CREATED', actorEmail: 'ada@x.co', createdAt: '2026-01-01T00:00:00Z' },
      { id: 'b', kind: 'COMPLETED', actorEmail: 'ada@x.co', createdAt: '2026-01-02T00:00:00Z' },
    ]);
    render(<ActivityFeed taskId="t1" nowMs={Date.now()} />, { wrapper: hookWrapper() });
    const items = await screen.findAllByTestId('activity-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('ada@x.co created this task');
    expect(items[1]).toHaveTextContent('ada@x.co completed this task');
  });
});
