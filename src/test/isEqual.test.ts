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

  it('should not equal 2', () => {
    const valueIsEqual = isEqual(
      { a: 1, c: [2, 3], b: 2 },
      { a: 1, c: [1, 2], b: 'x' },
    );
    expect(valueIsEqual).toBe(false);
  });

  it('should not equal 3', () => {
    const valueIsEqual = isEqual(
      { a: 1, c: [1, 2], b: 2 },
      { a: 1, c: [1], b: 'x' },
    );
    expect(valueIsEqual).toBe(false);
  });

  it('should not equal 4', () => {
    const valueIsEqual = isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: null });
    expect(valueIsEqual).toBe(false);
  });

  it('should not equal 5', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2 }, c: 1 },
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
