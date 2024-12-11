/**
 * @vitest-environment jsdom
 */
import resizeTo from '@src/testSupport/resizeTo';
import { expect, afterEach, vi } from 'vitest';
import { configure, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

const testTimeout = 30000;
configure({
  testIdAttribute: 'data-qa',
  asyncUtilTimeout: testTimeout - 2000,
});

vi.setConfig({ testTimeout });

expect.extend(matchers);

window.open = vi.fn();
window.resizeTo = resizeTo;
window.TextTrack = vi.fn();

window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollTo = vi.fn();

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

  vi.mock('react-router-dom', async () => {
    const mod = await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
    return {
      ...mod,
      useNavigate: () => vi.fn(),
      useParams: () => vi.fn(),
    };
  });
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.ResizeObserver =
  window.ResizeObserver ||
  vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

vi.mock('src/components/confetti/Confetti');

afterEach(() => {
  cleanup();
});
