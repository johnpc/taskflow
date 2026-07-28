import { describe, it, expect, vi } from 'vitest';

// The data client calls generateClient at import; stub the Amplify data module.
vi.mock('aws-amplify/data', () => ({ generateClient: () => ({ models: {} }) }));

import { dataClient } from './dataClient';
import { queryClient } from './queryClient';

describe('shared clients', () => {
  it('exposes a data client', () => {
    expect(dataClient).toBeDefined();
  });

  it('configures the react-query client with no window-focus refetch', () => {
    expect(queryClient.getDefaultOptions().queries?.refetchOnWindowFocus).toBe(false);
  });
});
