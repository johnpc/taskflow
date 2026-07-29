import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyLinkButton } from './CopyLinkButton';

const writeText = vi.fn();

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
});

describe('CopyLinkButton', () => {
  it('copies the task deep link and confirms', async () => {
    render(<CopyLinkButton taskId="t9" />);
    fireEvent.click(screen.getByTestId('task-copy-link'));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/tasks/t9')),
    );
    await waitFor(() => expect(screen.getByTestId('task-copy-link')).toHaveTextContent('Copied!'));
  });

  it('still confirms when the clipboard write rejects', async () => {
    writeText.mockRejectedValue(new Error('blocked'));
    render(<CopyLinkButton taskId="t1" />);
    fireEvent.click(screen.getByTestId('task-copy-link'));
    await waitFor(() => expect(screen.getByTestId('task-copy-link')).toHaveTextContent('Copied!'));
  });
});
