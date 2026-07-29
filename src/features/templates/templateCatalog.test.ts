import { describe, it, expect } from 'vitest';
import { TEMPLATES, templateByKey } from './templateCatalog';

describe('templateCatalog', () => {
  it('every template has sections and tasks that reference real sections', () => {
    for (const t of TEMPLATES) {
      expect(t.sections.length).toBeGreaterThan(0);
      for (const task of t.tasks) {
        expect(t.sections).toContain(task.section);
      }
    }
  });

  it('looks up a template by key', () => {
    expect(templateByKey('sprint')?.name).toBe('Sprint');
    expect(templateByKey('nope')).toBeUndefined();
  });
});
