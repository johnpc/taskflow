import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFromTemplate } from './createFromTemplate';
import type { ProjectTemplate } from './templateCatalog';

/** Mutation to spin up a project from a template, refreshing the project list on
 * success. Returns the created project id for navigation. */
export function useTemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { template: ProjectTemplate; sortOrder: number }) =>
      createFromTemplate(input.template, input.sortOrder),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}
