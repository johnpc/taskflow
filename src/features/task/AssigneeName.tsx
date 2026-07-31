import { useProfileDisplay } from '../profile/useProfileDisplay';

/** The read-only assignee label for a list row: the person's display name (if
 * set, else their email), or an em-dash when unassigned. Self-fetches the
 * profile (react-query dedupes per email). */
export function AssigneeName({ email }: { email: string | null | undefined }) {
  const { label } = useProfileDisplay(email);
  return (
    <span className="list-row__assignee" data-testid="row-assignee">
      {label || '—'}
    </span>
  );
}
