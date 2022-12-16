import isEqual from '../src/isEqual';

describe('isEqual', () => {
  it('should equal', () => {
    const valueIsEqual = isEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
    expect(valueIsEqual).toBe(true);
  });

  it('should not equal', () => {
    const valueIsEqual = isEqual({ a: 1, b: 2 }, { a: 1, b: 'x' });
    expect(valueIsEqual).toBe(false);
  });
});
