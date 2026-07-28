import { describe, it, expect, vi, afterEach } from 'vitest';
import { registerServiceWorker } from './registerServiceWorker';

afterEach(() => {
  vi.restoreAllMocks();
  // @ts-expect-error cleanup injected mock
  delete navigator.serviceWorker;
});

describe('registerServiceWorker', () => {
  it('no-ops when service workers are unsupported', () => {
    // navigator.serviceWorker absent by default in jsdom.
    expect(() => registerServiceWorker()).not.toThrow();
  });

  it('registers on window load when supported', () => {
    const register = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    });
    const addSpy = vi.spyOn(window, 'addEventListener');
    registerServiceWorker();
    // grab the load handler and invoke it
    const call = addSpy.mock.calls.find(([evt]) => evt === 'load');
    expect(call).toBeTruthy();
    (call![1] as EventListener)(new Event('load'));
    expect(register).toHaveBeenCalledWith('/sw.js');
  });
});
