import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('react-router-dom', () => ({ useHistory: () => ({ push }) }));

import { ProjectCrumb } from './ProjectCrumb';

describe('ProjectCrumb', () => {
  it('shows the project name and links to its board', () => {
    render(<ProjectCrumb projectId="p1" projectName="Launch" />);
    const crumb = screen.getByTestId('task-project-crumb');
    expect(crumb).toHaveTextContent('Launch');
    fireEvent.click(crumb);
    expect(push).toHaveBeenCalledWith('/projects/p1');
  });

  it('renders nothing until the project name resolves', () => {
    const { container } = render(<ProjectCrumb projectId="p1" projectName={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
