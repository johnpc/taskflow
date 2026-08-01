// jest-dom adds custom matchers for asserting on DOM nodes:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import { beforeEach } from 'vitest';

// Raise the default async timeout so waitFor assertions don't flake under the
// CPU contention of the pre-commit hook / CI (build + tests running together).
configure({ asyncUtilTimeout: 5000 });

// Isolate localStorage between tests: the theme store and any per-device state
// read/write it, so a value set in one test would otherwise leak into the next.
beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* jsdom without storage — nothing to clear */
  }
});

// jsdom doesn't implement Element.scrollTo; a scrollable IonSegment calls it on
// mount, which otherwise throws an uncaught error and fails the run.
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function () {};
}

// Mock matchMedia (jsdom doesn't implement it; Ionic + theme code call it).
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return false;
      },
    };
  };
