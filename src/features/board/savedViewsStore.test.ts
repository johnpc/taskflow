import { describe, it, expect, beforeEach } from 'vitest';
import { readViews, writeViews, addView, removeView } from './savedViewsStore';
import { DEFAULT_FILTER } from './taskFilter';

beforeEach(() => localStorage.clear());

const filter = { ...DEFAULT_FILTER, priority: 'HIGH' as const };

describe('savedViewsStore', () => {
  it('defaults to an empty list and round-trips', () => {
    expect(readViews('p')).toEqual([]);
    writeViews('p', [{ name: 'Urgent', filter }]);
    expect(readViews('p')).toEqual([{ name: 'Urgent', filter }]);
    expect(readViews('other')).toEqual([]);
  });

  it('returns empty on malformed JSON', () => {
    localStorage.setItem('tf-views-p', '{not json');
    expect(readViews('p')).toEqual([]);
  });

  it('addView trims, ignores blanks, and replaces by name', () => {
    let views = addView([], '  Urgent ', filter);
    expect(views).toEqual([{ name: 'Urgent', filter }]);
    views = addView(views, '', filter);
    expect(views).toHaveLength(1);
    const filter2 = { ...DEFAULT_FILTER, priority: 'LOW' as const };
    views = addView(views, 'Urgent', filter2);
    expect(views).toEqual([{ name: 'Urgent', filter: filter2 }]);
  });

  it('removeView drops by name', () => {
    const views = [
      { name: 'A', filter },
      { name: 'B', filter },
    ];
    expect(removeView(views, 'A').map((v) => v.name)).toEqual(['B']);
  });
});
