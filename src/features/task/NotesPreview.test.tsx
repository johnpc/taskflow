import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotesPreview } from './NotesPreview';

describe('NotesPreview', () => {
  it('renders nothing when empty', () => {
    const { container } = render(<NotesPreview notes={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders bold, safe links, and checklist items', () => {
    render(<NotesPreview notes={'**Ship** it [docs](https://x.io)\n[x] done\n[ ] todo'} />);
    expect(screen.getByText('Ship').tagName).toBe('STRONG');
    const link = screen.getByText('docs');
    expect(link).toHaveAttribute('href', 'https://x.io');
    expect(screen.getAllByTestId('notes-check')).toHaveLength(2);
  });

  it('does not render an unsafe link as an anchor', () => {
    render(<NotesPreview notes={'[x](javascript:alert(1))'} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
