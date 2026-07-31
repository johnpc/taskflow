import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// AssigneeAvatar self-fetches (react-query) — stub it for these bare renders.
vi.mock('../task/AssigneeAvatar', () => ({ AssigneeAvatar: () => null }));

import { CalendarTask } from './CalendarTask';

describe('CalendarTask', () => {
  it('renders the title and opens on click', () => {
    const onOpen = vi.fn();
    render(<CalendarTask title="Plan Q3 goals" onOpen={onOpen} />);
    expect(screen.getByText('Plan Q3 goals')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('calendar-task'));
    expect(onOpen).toHaveBeenCalled();
  });

  it('shows the project chip when a project is given', () => {
    render(
      <CalendarTask
        title="Plan Q3 goals"
        project={{ name: 'Personal', color: 'emerald' }}
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByTestId('calendar-project')).toHaveTextContent('Personal');
  });

  it('omits the project chip when no project is given', () => {
    render(<CalendarTask title="Solo" onOpen={vi.fn()} />);
    expect(screen.queryByTestId('calendar-project')).not.toBeInTheDocument();
  });
});
