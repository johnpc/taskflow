import { describe, it, expect } from 'vitest';
import { PROJECT_COLORS, toProjectColor, projectColorVar, nextProjectColor } from './projectColors';

describe('projectColors', () => {
  it('passes through a known color', () => {
    expect(toProjectColor('sky')).toBe('sky');
  });

  it('defaults unknown/null to indigo', () => {
    expect(toProjectColor('chartreuse')).toBe('indigo');
    expect(toProjectColor(null)).toBe('indigo');
    expect(toProjectColor(undefined)).toBe('indigo');
  });

  it('builds the CSS var reference', () => {
    expect(projectColorVar('emerald')).toBe('var(--tf-proj-emerald)');
    expect(projectColorVar(null)).toBe('var(--tf-proj-indigo)');
  });

  it('cycles colors by creation order', () => {
    expect(nextProjectColor(0)).toBe(PROJECT_COLORS[0]);
    expect(nextProjectColor(PROJECT_COLORS.length)).toBe(PROJECT_COLORS[0]);
    expect(nextProjectColor(2)).toBe(PROJECT_COLORS[2]);
  });
});
