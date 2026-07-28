import { useQuery } from '@tanstack/react-query';
import { dataClient, type SectionRecord } from '../../lib/dataClient';

/** The sections of a task's project, ordered — for the "move to section" picker
 * on task detail. Enabled only once the projectId is known. */
export function useTaskSections(projectId: string | undefined) {
  return useQuery({
    queryKey: ['sections', projectId],
    queryFn: async () => {
      const { data } = await dataClient.models.Section.listSectionByProjectIdAndSortOrder(
        { projectId: projectId! },
        { limit: 200 },
      );
      return (data ?? []).filter(Boolean) as SectionRecord[];
    },
    enabled: !!projectId,
  });
}
