import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const { coverUrl } = vi.hoisted(() => ({ coverUrl: vi.fn() }));
vi.mock('./coverApi', () => ({ coverUrl }));

import { hookWrapper } from '../../test/hookWrapper';
import { CardCover } from './CardCover';
import type { TaskRecord } from '../../lib/dataClient';

beforeEach(() => coverUrl.mockReset());

describe('CardCover', () => {
  it('renders nothing when the task has no cover', () => {
    const { container } = render(<CardCover task={{ coverKey: null } as TaskRecord} />, {
      wrapper: hookWrapper(),
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the resolved cover image', async () => {
    coverUrl.mockResolvedValue('https://s3/cover');
    render(<CardCover task={{ coverKey: 'covers/t1.png' } as TaskRecord} />, {
      wrapper: hookWrapper(),
    });
    expect(await screen.findByTestId('task-cover')).toHaveAttribute('src', 'https://s3/cover');
  });
});
