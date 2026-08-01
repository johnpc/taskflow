import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';

// The share / status / fields regions self-fetch + use auth; stub them (own tests cover them).
vi.mock('./ProjectShareRegion', () => ({ ProjectShareRegion: () => null }));
vi.mock('./StatusUpdatesRegion', () => ({ StatusUpdatesRegion: () => null }));
vi.mock('./ProjectResourcesRegion', () => ({ ProjectResourcesRegion: () => null }));
vi.mock('../customfields/ProjectFieldsRegion', () => ({ ProjectFieldsRegion: () => null }));

import { renderWithProviders } from '../../test/renderWithProviders';
import { ProjectHeaderRegion } from './ProjectHeaderRegion';
import type { ProjectRecord } from '../../lib/dataClient';

const edit = { mutate: vi.fn() } as unknown as Parameters<typeof ProjectHeaderRegion>[0]['edit'];

describe('ProjectHeaderRegion', () => {
  it('renders the header when a project is given', () => {
    renderWithProviders(
      <ProjectHeaderRegion
        id="p"
        project={{ id: 'p', name: 'Launch', color: 'indigo' } as ProjectRecord}
        members={[]}
        edit={edit}
        onAddSection={vi.fn()}
      />,
    );
    expect(screen.getByTestId('project-header')).toBeInTheDocument();
  });

  it('omits the header when no project is loaded yet', () => {
    renderWithProviders(
      <ProjectHeaderRegion
        id="p"
        project={undefined}
        members={[]}
        edit={edit}
        onAddSection={vi.fn()}
      />,
    );
    expect(screen.queryByTestId('project-header')).not.toBeInTheDocument();
  });
});
