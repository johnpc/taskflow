import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// AssigneeAvatar self-fetches (react-query) — stub it for these bare renders.
vi.mock('../task/AssigneeAvatar', () => ({ AssigneeAvatar: () => null }));

import { SearchHit } from './SearchHit';
import type { TaskRecord } from '../../lib/dataClient';

const task = (over: Partial<TaskRecord>): TaskRecord =>
  ({ id: 't', title: 'Ship it', dueDate: null, ...over }) as TaskRecord;

describe('SearchHit', () => {
  it('renders the title and opens on click', () => {
    const onOpen = vi.fn();
    render(<SearchHit task={task({})} onOpen={onOpen} />);
    expect(screen.getByText('Ship it')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('search-hit'));
    expect(onOpen).toHaveBeenCalled();
  });

  it('shows the project chip and due label when present', () => {
    render(
      <SearchHit
        task={task({ dueDate: '2000-01-01' })}
        project={{ name: 'Launch', color: 'sky' }}
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByTestId('hit-project')).toHaveTextContent('Launch');
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByTestId('hit-due')).toHaveClass('search__hit-due--overdue');
  });

  it('does not flag a far-future due date as overdue', () => {
    render(<SearchHit task={task({ dueDate: '2999-01-01' })} onOpen={vi.fn()} />);
    expect(screen.getByTestId('hit-due')).not.toHaveClass('search__hit-due--overdue');
  });

  it('omits the project chip when no project is given', () => {
    render(<SearchHit task={task({})} onOpen={vi.fn()} />);
    expect(screen.queryByTestId('hit-project')).not.toBeInTheDocument();
  });
});
