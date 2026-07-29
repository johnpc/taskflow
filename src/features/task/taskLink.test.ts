import { describe, it, expect } from 'vitest';
import { taskLink } from './taskLink';

describe('taskLink', () => {
  it('joins origin + task route', () => {
    expect(taskLink('https://taskflow.app', 't1')).toBe('https://taskflow.app/tasks/t1');
  });

  it('trims a trailing slash on the origin', () => {
    expect(taskLink('https://taskflow.app/', 't1')).toBe('https://taskflow.app/tasks/t1');
  });
});
