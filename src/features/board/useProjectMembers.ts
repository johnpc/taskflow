import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setProjectMembers } from '../projects/projectMembersApi';
import { addMember, removeMember } from '../projects/memberList';

/** Add/remove project members, cascading the list to all child records and
 * refreshing the project + board queries. The current members are passed in
 * (from the loaded project) so the pure add/remove helpers compute the new list. */
export function useProjectMembers(projectId: string, current: string[]) {
  const qc = useQueryClient();
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['project', projectId] });
    qc.invalidateQueries({ queryKey: ['board', projectId] });
  };
  const mutate = useMutation({
    mutationFn: (members: string[]) => setProjectMembers(projectId, members),
    onSuccess: refresh,
  });
  return {
    busy: mutate.isPending,
    add: (email: string) => mutate.mutate(addMember(current, email)),
    remove: (email: string) => mutate.mutate(removeMember(current, email)),
  };
}
