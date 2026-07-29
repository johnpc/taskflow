import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Trigger({ onUndo }: { onUndo: () => void }) {
  const { showUndo } = useToast();
  return <button onClick={() => showUndo({ message: 'Done', onUndo })}>go</button>;
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast and runs onUndo on click', () => {
    const onUndo = vi.fn();
    render(
      <ToastProvider>
        <Trigger onUndo={onUndo} />
      </ToastProvider>,
    );
    act(() => screen.getByText('go').click());
    expect(screen.getByTestId('undo-toast')).toHaveTextContent('Done');
    fireEvent.click(screen.getByTestId('undo-toast-action'));
    expect(onUndo).toHaveBeenCalledOnce();
    expect(screen.queryByTestId('undo-toast')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the timeout', () => {
    render(
      <ToastProvider>
        <Trigger onUndo={vi.fn()} />
      </ToastProvider>,
    );
    act(() => screen.getByText('go').click());
    expect(screen.getByTestId('undo-toast')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.queryByTestId('undo-toast')).not.toBeInTheDocument();
  });
});
