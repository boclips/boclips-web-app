import '@testing-library/jest-dom/extend-expect';
import { configure } from '@testing-library/react';
import resizeTo from 'src/testSupport/resizeTo';
import '@testing-library/jest-dom';

const jestTimeout = 30000;

configure({
  testIdAttribute: 'data-qa',
  asyncUtilTimeout: jestTimeout - 2000,
});

jest.setTimeout(jestTimeout);

const { toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

window.resizeTo = resizeTo;

window.scrollTo = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollTo = jest.fn();

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
    jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

// jsdom is not good with css. This is silencing jsdom parsing css error
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation((e) => {
    if (
      typeof e === 'string' &&
      e.includes('Error: Could not parse CSS stylesheet')
    ) {
      return null;
    }

    return e;
  });
});
