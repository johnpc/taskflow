import { statusMeta } from './projectStatus';
import './projects.css';

/** A colored health pill (On track / At risk / Off track). Renders nothing when
 * the project has no status set. Presentational; color from the status token. */
export function StatusPill({ status }: { status?: string | null }) {
  const meta = statusMeta(status);
  if (!meta) return null;
  return (
    <span
      className="status-pill"
      data-testid="status-pill"
      data-status={meta.value}
      style={{ ['--pill' as string]: `var(${meta.colorVar})` }}
    >
      <span className="status-pill__dot" />
      {meta.label}
    </span>
  );
}
