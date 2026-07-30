import { SavedViews } from './SavedViews';
import { useSavedViews } from './useSavedViews';
import type { BoardFilter } from './taskFilter';

/** Wires a project's saved filter views to the SavedViews bar: saving names the
 * CURRENT filter, applying replaces the live filter. Split from ProjectView so
 * that screen stays a thin composer under the line limit. */
export function SavedViewsRegion({
  projectId,
  filter,
  onApply,
}: {
  projectId: string;
  filter: BoardFilter;
  onApply: (filter: BoardFilter) => void;
}) {
  const { views, save, remove } = useSavedViews(projectId);
  return (
    <SavedViews
      views={views}
      onApply={(v) => onApply(v.filter)}
      onSave={(name) => save(name, filter)}
      onDelete={remove}
    />
  );
}
