import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, saveDisplayName } from './userProfileApi';
import { useAuth } from '../auth/useAuth';

/** The signed-in user's display name: loads it, holds an editable draft, and
 * saves it (upsert). The draft syncs to the loaded value once it arrives.
 * Server state via react-query so member-name lookups share the cache. */
export function useDisplayName() {
  const { email } = useAuth();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['profile', email],
    queryFn: () => fetchProfile(email!),
    enabled: !!email,
  });
  const [draft, setDraft] = useState('');
  useEffect(() => {
    if (query.data?.displayName) setDraft(query.data.displayName);
  }, [query.data?.displayName]);

  const save = useMutation({
    mutationFn: (name: string) => saveDisplayName(email!, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', email] }),
  });

  return { draft, setDraft, save, saved: query.data?.displayName ?? null };
}
