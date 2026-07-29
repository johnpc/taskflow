import { useMutation } from '@tanstack/react-query';
import { createSection, renameSection, deleteSection, setSectionOrder } from './sectionsApi';
import { reorderSections } from './reorderSections';
import type { SectionRecord } from '../../lib/dataClient';

/** Section mutations for a project's board — add / rename / delete / move (left
 * or right). Split out of useBoard to keep that hub small. `sections` supplies
 * the current order for append + reorder math; `invalidate` refreshes the board. */
export function useSectionMutations(
  projectId: string,
  sections: SectionRecord[],
  invalidate: () => void,
) {
  const addSection = useMutation({
    mutationFn: (name: string) => createSection({ projectId, name, order: sections.length }),
    onSuccess: invalidate,
  });

  const editSection = useMutation({
    mutationFn: (input: { id: string; name: string }) => renameSection(input.id, input.name),
    onSuccess: invalidate,
  });

  const removeSection = useMutation({
    mutationFn: (id: string) => deleteSection(id),
    onSuccess: invalidate,
  });

  const moveSection = useMutation({
    mutationFn: async (input: { sectionId: string; direction: 'left' | 'right' }) => {
      const updates = reorderSections(sections, input.sectionId, input.direction);
      await Promise.all(updates.map((u) => setSectionOrder(u.id, u.sortOrder)));
    },
    onSuccess: invalidate,
  });

  return { addSection, editSection, removeSection, moveSection };
}
