import { isStyleSupport } from '../src/Dom/styleChecker';

describe('StyleChecker', () => {
  it('style name', () => {
    expect(isStyleSupport(['position'])).toBeTruthy();
    expect(isStyleSupport('not-exist')).toBeFalsy();
  });

  // It is always true in jest. Sad
  it('style value', () => {
    expect(isStyleSupport('position', 'sticky')).toBeTruthy();
  });
});
