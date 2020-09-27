/* eslint-disable no-eval */
import contains from '../src/Dom/contains';

describe('contains', () => {
  it('match', () => {
    const root = document.createElement('div');
    const child = document.createElement('div');

    expect(contains(null, child)).toBeFalsy();
    expect(contains(root, child)).toBeFalsy();

    root.appendChild(child);
    expect(contains(root, child)).toBeTruthy();
  });
});
