import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const { useProfileDisplay } = vi.hoisted(() => ({ useProfileDisplay: vi.fn() }));
vi.mock('../profile/useProfileDisplay', () => ({ useProfileDisplay }));

import { AssigneeName } from './AssigneeName';

beforeEach(() => useProfileDisplay.mockReset());

describe('AssigneeName', () => {
  it('shows the resolved display label', () => {
    useProfileDisplay.mockReturnValue({ label: 'Ada Lovelace', initials: 'AL' });
    render(<AssigneeName email="ada@x.co" />);
    expect(screen.getByTestId('row-assignee')).toHaveTextContent('Ada Lovelace');
  });

  it('shows an em-dash when unassigned', () => {
    useProfileDisplay.mockReturnValue({ label: '', initials: '' });
    render(<AssigneeName email={null} />);
    expect(screen.getByTestId('row-assignee')).toHaveTextContent('—');
  });
});
