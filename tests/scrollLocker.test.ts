import ScrollLocker from '../src/Dom/scrollLocker';

jest.mock('../src/getScrollBarSize', () =>
  jest.fn().mockImplementation(() => 20),
);

describe('ScrollLocker', () => {
  const effectClassname = 'ant-scrolling-effect';
  let scrollLocker: ScrollLocker;

  // https://github.com/jsdom/jsdom/issues/1332
  // JSDom eats `calc`, so we don't test it.
  const effectStyle = 'position: relative; overflow: hidden; overflow-x: hidden; overflow-y: hidden;';
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
    expect(document.body.getAttribute('style')).toBe('');
  });

  it('Lock multiple same target and unLock', () => {
    scrollLocker.lock();
    scrollLocker.lock();
    scrollLocker.lock();

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');

    scrollLocker.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
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
    expect(document.body.getAttribute('style')).toBe('');
  });

  it('Lock multiple different target and container and unLock', () => {
    const testContainer = document.createElement('div');

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
    expect(document.body.getAttribute('style')).toBe('');
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    scrollLocker.unLock();
    locker2.unLock();

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
    expect(testContainer.className).toBe('');
    expect(testContainer.getAttribute('style')).toBe('');
  });
});
