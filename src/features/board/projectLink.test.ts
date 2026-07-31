import { describe, it, expect } from 'vitest';
import { projectLink } from './projectLink';

describe('projectLink', () => {
  it('builds the project deep link from the origin + id', () => {
    expect(projectLink('https://taskflow.app', 'p1')).toBe('https://taskflow.app/projects/p1');
  });

  it('strips a trailing slash on the origin', () => {
    expect(projectLink('https://taskflow.app/', 'p1')).toBe('https://taskflow.app/projects/p1');
  });
});
