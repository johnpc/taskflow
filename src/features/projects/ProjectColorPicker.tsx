import { PROJECT_COLORS, projectColorVar, toProjectColor } from './projectColors';
import './projects.css';

/** A row of color swatches for recoloring a project. The active color is ringed;
 * picking one delegates the change up. Presentational. */
export function ProjectColorPicker({
  color,
  onPick,
}: {
  color: string | null | undefined;
  onPick: (color: string) => void;
}) {
  const active = toProjectColor(color);
  return (
    <div
      className="project-colors"
      data-testid="project-colors"
      role="group"
      aria-label="Project color"
    >
      {PROJECT_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          className="project-colors__swatch"
          data-testid={`project-color-${c}`}
          aria-label={c}
          aria-pressed={active === c}
          style={{ background: projectColorVar(c) }}
          onClick={() => onPick(c)}
        />
      ))}
    </div>
  );
}
