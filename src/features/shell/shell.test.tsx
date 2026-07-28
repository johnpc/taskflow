import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { star } from 'ionicons/icons';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';
import { SkeletonRows } from './SkeletonRows';
import { TabBar } from './TabBar';
import { NotFound } from './NotFound';
import { ErrorFallback } from './ErrorFallback';
import { LazyRoute } from './LazyRoute';

const router = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('shell components', () => {
  it('EmptyState renders title, message, and action', () => {
    render(
      <EmptyState icon={star} title="Nothing" message="add one" testId="es">
        <button>Do it</button>
      </EmptyState>,
    );
    expect(screen.getByText('Nothing')).toBeInTheDocument();
    expect(screen.getByText('add one')).toBeInTheDocument();
    expect(screen.getByText('Do it')).toBeInTheDocument();
  });

  it('Skeleton renders with a custom size', () => {
    render(<Skeleton width="50%" height="2rem" radius="50%" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('SkeletonRows renders the requested count', () => {
    render(<SkeletonRows count={3} />);
    expect(screen.getByTestId('skeleton-rows').children).toHaveLength(3);
  });

  it('TabBar marks the active tab', () => {
    router(<TabBar active="Search" />);
    const search = screen.getByRole('link', { name: 'Search' });
    expect(search).toHaveAttribute('aria-current', 'page');
  });

  it('NotFound links back to projects', () => {
    router(<NotFound />);
    expect(screen.getByTestId('not-found-home')).toHaveAttribute('href', '/projects');
  });

  it('ErrorFallback calls onReload', () => {
    const onReload = vi.fn();
    router(<ErrorFallback onReload={onReload} />);
    screen.getByTestId('error-reload').click();
    expect(onReload).toHaveBeenCalledOnce();
  });

  it('LazyRoute renders its children', () => {
    render(
      <LazyRoute>
        <div>lazy content</div>
      </LazyRoute>,
    );
    expect(screen.getByText('lazy content')).toBeInTheDocument();
  });
});
