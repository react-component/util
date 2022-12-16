import isEqual from '../isEqual';

describe('isEqual', () => {
  it('should equal', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: 2, c: [1, 2] },
      { a: 1, b: 2, c: [1, 2] },
    );
    expect(valueIsEqual).toBe(true);
  });

  const obj = { a: 1, b: 2, c: [1, 2], obj: null };
  it('should equal 2', () => {
    const valueIsEqual = isEqual(obj, obj);
    expect(valueIsEqual).toBe(true);
  });

  it('should not equal', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: 2, c: [2, 3] },
      { a: 1, b: 'x', c: [1, 2] },
    );
    expect(valueIsEqual).toBe(false);
  });

  it('should throw error', () => {
    obj.obj = obj;
    const obj2 = { a: 1, b: 2, c: [1, 2], obj: null };
    try {
      const valueIsEqual = isEqual(obj, obj2);
      expect(valueIsEqual).toBe(true);
    } catch (error) {
      expect(error.message).toBe('There may be circular references');
    }
  });
});
