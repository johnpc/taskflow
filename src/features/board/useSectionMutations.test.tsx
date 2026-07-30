import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const { createSection, renameSection, deleteSection, setSectionOrder, duplicateSection } =
  vi.hoisted(() => ({
    createSection: vi.fn(),
    renameSection: vi.fn(),
    deleteSection: vi.fn(),
    setSectionOrder: vi.fn(),
    duplicateSection: vi.fn(),
  }));
vi.mock('./sectionsApi', () => ({ createSection, renameSection, deleteSection, setSectionOrder }));
vi.mock('./duplicateSectionApi', () => ({ duplicateSection }));

import { hookWrapper } from '../../test/hookWrapper';
import { useSectionMutations } from './useSectionMutations';
import type { SectionRecord } from '../../lib/dataClient';

const sections = [
  { id: 'a', sortOrder: 0 },
  { id: 'b', sortOrder: 1 },
] as SectionRecord[];

beforeEach(() => {
  createSection.mockReset();
  renameSection.mockReset();
  deleteSection.mockReset();
  setSectionOrder.mockReset();
});

describe('useSectionMutations', () => {
  it('adds a section appended after the current last', async () => {
    createSection.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSectionMutations('p', sections, vi.fn()), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.addSection.mutateAsync('Review');
    });
    expect(createSection).toHaveBeenCalledWith({ projectId: 'p', name: 'Review', order: 2 });
  });

  it('duplicates a section via the copy API', async () => {
    duplicateSection.mockResolvedValue({ id: 'a-copy' });
    const { result } = renderHook(() => useSectionMutations('p', sections, vi.fn()), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.copySection.mutateAsync(sections[0]);
    });
    expect(duplicateSection).toHaveBeenCalledWith(sections[0]);
  });

  it('moves a section by patching the two swapped orders', async () => {
    setSectionOrder.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSectionMutations('p', sections, vi.fn()), {
      wrapper: hookWrapper(),
    });
    await act(async () => {
      await result.current.moveSection.mutateAsync({ sectionId: 'b', direction: 'left' });
    });
    expect(setSectionOrder).toHaveBeenCalledWith('b', 0);
    expect(setSectionOrder).toHaveBeenCalledWith('a', 1);
  });
});
