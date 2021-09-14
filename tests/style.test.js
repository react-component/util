import { isStyleSupport } from '../src/Dom/styleChecker';

describe('StyleChecker', () => {
  it('isStyleSupport', () => {
    expect(isStyleSupport('position')).toBeTruthy();
    expect(isStyleSupport('not-exist')).toBeFalsy();
  });
});
