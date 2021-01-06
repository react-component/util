import { spyElementPrototypes } from '../src/test/domHook';
import ScrollLocker from '../src/Dom/scrollLocker';

jest.mock('../src/getScrollBarSize', () =>
  jest.fn().mockImplementation(() => 20),
);

describe('ScrollLocker', () => {
  const effectClassname = 'ant-scrolling-effect';
  let scrollLocker: ScrollLocker;

  const effectStyle =
    'overflow: hidden; overflow-x: hidden; overflow-y: hidden;';

  // jsdom can not capture calc
  const initialStyle = '';

  beforeEach(() => {
    scrollLocker = new ScrollLocker();
  });

  afterEach(() => {
    if (scrollLocker) {
      scrollLocker.unLock();
    }
  });

  it('Lock and unLock', () => {
    scrollLocker.lock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    document.body.style.paddingRight = undefined;
    expect(document.body.getAttribute('style')).toBe(initialStyle);
  });

  it('Lock multiple same target and unLock', () => {
    scrollLocker.lock();
    scrollLocker.lock();
    scrollLocker.lock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe(initialStyle);

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe(initialStyle);
  });

  it('Lock multiple different target and unLock', () => {
    const locker1 = new ScrollLocker();
    const locker2 = new ScrollLocker();

    scrollLocker.lock();
    locker1.lock();
    locker2.lock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    locker2.unLock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    locker1.unLock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe(initialStyle);
  });

  it('Lock multiple different target and container and unLock', () => {
    const testContainer = document.createElement('div');

    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollHeight: {
        get: () => 100,
      },
      clientWidth: {
        get: () => 90,
      },
    });

    const locker1 = new ScrollLocker({
      container: testContainer,
    });
    const locker2 = new ScrollLocker({
      container: testContainer,
    });

    scrollLocker.lock();
    locker1.lock();
    locker2.lock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    locker1.unLock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe(initialStyle);
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();
    locker2.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe(initialStyle);
    expect(testContainer.className).toBe('');
    expect(testContainer.getAttribute('style')).toBe(initialStyle);

    domSpy.mockRestore();
  });

  it('reLock', () => {
    scrollLocker.lock();
    const testContainer = document.createElement('div');

    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollHeight: {
        get: () => 100,
      },
      clientWidth: {
        get: () => 90,
      },
    });

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    scrollLocker.reLock({
      container: testContainer,
    });

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe(initialStyle);

    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    domSpy.mockRestore();
  });
});
