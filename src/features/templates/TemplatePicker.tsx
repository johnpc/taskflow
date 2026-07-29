import { projectColorVar } from '../projects/projectColors';
import { TEMPLATES, type ProjectTemplate } from './templateCatalog';
import './templates.css';

/** A horizontal strip of project-template cards on the Projects screen. Picking
 * one spins up a ready-made project. Presentational; creation delegated. */
export function TemplatePicker({
  onPick,
  busy,
}: {
  onPick: (t: ProjectTemplate) => void;
  busy: boolean;
}) {
  return (
    <div className="template-picker" data-testid="template-picker">
      <p className="tf-kicker template-picker__kicker">Start from a template</p>
      <div className="template-picker__row">
        {TEMPLATES.map((t) => (
          <button
            key={t.key}
            type="button"
            className="template-card"
            data-testid={`template-${t.key}`}
            disabled={busy}
            onClick={() => onPick(t)}
          >
            <span
              className="template-card__dot"
              style={{ background: projectColorVar(t.color) }}
              aria-hidden="true"
            />
            <span className="template-card__name">{t.name}</span>
            <span className="template-card__desc">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
