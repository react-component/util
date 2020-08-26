import { lock, unLock } from '../src/Dom/scrollLocker';
import getScrollBarSize from '../src/getScrollBarSize';

jest.mock('../src/getScrollBarSize', () =>
  jest.fn().mockImplementation(() => 20),
);

describe('ScrollLocker', () => {
  let testTarget: HTMLElement;
  const effectClassname = 'ant-scrolling-effect';

  // https://github.com/jsdom/jsdom/issues/1332
  // JSDom eats `calc`, so we don't test it.
  const effectStyle = 'position: relative;';
  beforeEach(() => {
    testTarget = document.createElement('div');
  });

  it('Lock and unLock', () => {
    lock(testTarget);

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
  });

  it('Lock multiple same target and unLock', () => {
    lock(testTarget);
    lock(testTarget);
    lock(testTarget);

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');

    unLock(testTarget);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
  });

  it('Lock multiple different target and unLock', () => {
    const testTarget1 = document.createElement('div');
    const testTarget2 = document.createElement('div');

    // first-in-last-out
    lock(testTarget);
    lock(testTarget1);
    lock(testTarget2);

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget2);

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget1);

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
  });

  it('Lock multiple different target and container and unLock', () => {
    const testTarget1 = document.createElement('div');

    const testContainer = document.createElement('div');
    const testContainerTarget1 = document.createElement('div');
    const testContainerTarget2 = document.createElement('div');

    // first-in-last-out
    lock(testTarget);
    lock(testContainerTarget1, {
      container: testContainer,
    });

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    lock(testTarget1);
    lock(testContainerTarget2, {
      container: testContainer,
    });

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget1);

    expect(document.body.className).toBe(effectClassname);
    expect(document.body.getAttribute('style')).toBe(effectStyle);
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget);
    unLock(testContainerTarget2);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
    expect(testContainer.className).toBe(effectClassname);
    expect(testContainer.getAttribute('style')).toBe(effectStyle);

    unLock(testTarget);
    unLock(testContainerTarget1);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
    expect(testContainer.className).toBe('');
    expect(testContainer.getAttribute('style')).toBe('');
  });

  it('Lock empty target and unLock', () => {
    lock(undefined);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');

    unLock(undefined);

    expect(document.body.className).toBe('');
    expect(document.body.getAttribute('style')).toBe('');
  });
});
