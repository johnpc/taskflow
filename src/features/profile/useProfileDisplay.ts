import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from './userProfileApi';
import { displayLabel, displayInitials } from './displayLabel';

/** Resolve a user's display label + initials for rendering on shared work
 * (cards, member stacks). Keyed by email so react-query dedupes the lookup
 * across every card sharing an assignee. Falls back to the email/its initials
 * until (or unless) a profile is found. */
export function useProfileDisplay(email: string | null | undefined) {
  const query = useQuery({
    queryKey: ['profile', email],
    queryFn: () => fetchProfile(email!),
    enabled: !!email,
    staleTime: 5 * 60_000,
  });
  const name = query.data?.displayName ?? null;
  return {
    label: email ? displayLabel(email, name) : '',
    initials: email ? displayInitials(email, name) : '',
  };
}
