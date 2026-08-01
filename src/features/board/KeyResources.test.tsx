import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeyResources } from './KeyResources';
import type { ProjectResourceRecord } from '../../lib/dataClient';

const res = (over: Partial<ProjectResourceRecord>): ProjectResourceRecord =>
  ({ id: 'r', title: 'Spec', url: 'https://example.com', ...over }) as ProjectResourceRecord;

describe('KeyResources', () => {
  it('renders links with a safe href and removes them', () => {
    const onRemove = vi.fn();
    render(<KeyResources resources={[res({})]} busy={false} onAdd={vi.fn()} onRemove={onRemove} />);
    const link = screen.getByText('Spec');
    expect(link).toHaveAttribute('href', 'https://example.com');
    fireEvent.click(screen.getByTestId('key-resource-remove'));
    expect(onRemove).toHaveBeenCalledWith('r');
  });

  it('renders a javascript: url as plain text (safeHref guard)', () => {
    render(
      <KeyResources
        resources={[res({ id: 'x', title: 'Bad', url: 'javascript:alert(1)' })]}
        busy={false}
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.getByText('Bad').tagName).toBe('SPAN'); // not an anchor
  });

  it('adds a resource only with a title + safe url', () => {
    const onAdd = vi.fn();
    render(<KeyResources resources={[]} busy={false} onAdd={onAdd} onRemove={vi.fn()} />);
    const add = screen.getByTestId('key-resource-add');
    expect(add).toBeDisabled(); // empty
    fireEvent.change(screen.getByTestId('key-resource-title'), { target: { value: 'Design' } });
    fireEvent.change(screen.getByTestId('key-resource-url'), {
      target: { value: 'https://figma.com/x' },
    });
    fireEvent.click(add);
    expect(onAdd).toHaveBeenCalledWith({ title: 'Design', url: 'https://figma.com/x' });
  });
});
