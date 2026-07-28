import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadState } from './LoadState';

describe('LoadState', () => {
  it('shows a skeleton while loading', () => {
    render(
      <LoadState isLoading>
        <div>content</div>
      </LoadState>,
    );
    expect(screen.getByTestId('load-loading')).toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('shows a retryable error (error beats empty)', () => {
    const onRetry = vi.fn();
    render(
      <LoadState isLoading={false} isError isEmpty onRetry={onRetry}>
        <div>content</div>
      </LoadState>,
    );
    expect(screen.getByTestId('load-error')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('load-retry'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('shows the empty state with custom copy', () => {
    render(
      <LoadState isLoading={false} isEmpty emptyTitle="Nothing" emptyMessage="add one">
        <div>content</div>
      </LoadState>,
    );
    expect(screen.getByTestId('load-empty')).toBeInTheDocument();
    expect(screen.getByText('Nothing')).toBeInTheDocument();
  });

  it('renders children when ready', () => {
    render(
      <LoadState isLoading={false}>
        <div>content</div>
      </LoadState>,
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
