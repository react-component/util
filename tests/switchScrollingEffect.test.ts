import switchScrollingEffect from '../src/switchScrollingEffect';
import { spyElementPrototypes } from '../src/test/domHook';
import getScrollBarSize from '../src/getScrollBarSize';

jest.mock('../src/getScrollBarSize', () =>
  jest.fn().mockImplementation(() => 20),
);

/**
 * Jest dom default window innerWidth is 1024, innerHeight is 768
 * Jest silently eats 'calc'
 * https://github.com/jsdom/jsdom/issues/1332
 */

describe('switchScrollingEffect', () => {
  beforeEach(() => {
    // reset
    document.body.className = '';
    document.body.setAttribute('style', '');
    getScrollBarSize.mockClear();
  });

  it('switchScrollingEffect correct', () => {
    switchScrollingEffect();

    expect(document.body.style.cssText).toBe('');

    const bodyMock = spyElementPrototypes(HTMLBodyElement, {
      scrollHeight: {
        get: () => 5000,
      },
      offsetWidth: {
        get: () => 748,
      },
    });

    switchScrollingEffect();

    expect(document.body.style.cssText).toBe('position: relative; width: calc(100% - 20px);');
    expect(document.body.className).toBe('ant-scrolling-effect');

    // when closed
    switchScrollingEffect(true);
    expect(document.body.style.cssText).toBe('');
    expect(document.body.className).toBe('');

    bodyMock.mockRestore();
  });
});
