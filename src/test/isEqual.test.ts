import isEqual from '../isEqual';
import warning from '../warning';

describe('isEqual', () => {
  let errorSpy: jest.SpyInstance;

  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockReset();
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  it('should equal', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: 2, c: [1, 2] },
      { a: 1, b: 2, c: [1, 2] },
    );
    expect(valueIsEqual).toBe(true);
  });

  it('should equal shallow', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 2, c: 3 },
      true,
    );
    expect(valueIsEqual).toBe(true);
  });

  it('should not equal shallow', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: 2, c: 3 },
      { a: 1, b: 2, c: 4 },
      true,
    );
    expect(valueIsEqual).toBe(false);
  });

  it('should not equal shallow 2', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: 2, c: [2, 3] },
      { a: 1, b: 2, c: [2, 3] },
      true,
    );
    expect(valueIsEqual).toBe(false);
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
    const valueIsEqual = isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: 1 });
    expect(valueIsEqual).toBe(false);
  });

  it('should not equal 5', () => {
    const valueIsEqual = isEqual(
      { a: 1, b: { c: 2 } },
      { a: 1, b: { c: 2 }, c: 1 },
    );
    expect(valueIsEqual).toBe(false);
  });

  it('should not equal 6', () => {
    obj.obj = obj;
    const obj2 = { a: 1, b: 2, c: [1, 2], obj: null };
    warning(false, 'error');
    expect(errorSpy).toHaveBeenCalledWith('Warning: error');

    const valueIsEqual = isEqual(obj, obj2);
    expect(valueIsEqual).toBe(false);
  });
});
