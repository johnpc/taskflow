import { Skeleton } from './Skeleton';

interface SkeletonRowsProps {
  /** How many placeholder rows to show (default 5). */
  count?: number;
  /** Accessible label announced while the real content loads. */
  label?: string;
  /** Shape of the placeholder rows. `card` (default) previews floating cards
   * (Projects, Home). `row` previews the dense ruled list — hairline dividers,
   * no card chrome — so the skeleton matches the dense list screens (My Tasks,
   * Completed, Calendar agenda) instead of promising fat cards that then snap
   * to a flat list. */
  variant?: 'card' | 'row';
}

/** A list of skeleton rows — the default placeholder for a data screen's list
 * while it loads. Each row previews a title line + a shorter meta line. Purely a
 * loading affordance; `variant` matches the target content's shape. */
export function SkeletonRows({
  count = 5,
  label = 'Loading',
  variant = 'card',
}: SkeletonRowsProps) {
  return (
    <ul
      className={variant === 'row' ? 'tf-skeleton-rows tf-skeleton-rows--flat' : 'tf-skeleton-rows'}
      aria-busy="true"
      aria-label={label}
      data-testid="skeleton-rows"
    >
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="tf-skeleton-row">
          <Skeleton width="62%" height="1.1rem" />
          <Skeleton width="34%" height="0.8rem" />
        </li>
      ))}
    </ul>
  );
}
