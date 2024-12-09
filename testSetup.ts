/**
 * @vitest-environment jsdom
 */

import { configure } from '@testing-library/react';
import resizeTo from '@src/testSupport/resizeTo';
import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

const testTimeout = 30000;

configure({
  testIdAttribute: 'data-qa',
  asyncUtilTimeout: testTimeout - 2000,
});

vi.setConfig({ testTimeout: testTimeout });

expect.extend(matchers);

// const { toHaveNoViolations } = require('jest-axe');
// expect.extend(toHaveNoViolations);

window.resizeTo = resizeTo;

window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollTo = vi.fn();

// @ts-ignore
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

window.ResizeObserver =
  window.ResizeObserver ||
  vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

// jsdom is not good with css. This is silencing jsdom parsing css error
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation((e) => {
    if (
      typeof e === 'string' &&
      e.includes('Error: Could not parse CSS stylesheet')
    ) {
      return null;
    }

    return e;
  });
});

vi.mock('src/components/confetti/Confetti');
