import isEqual from '../isEqual';
import warning, { resetWarned } from '../warning';

describe('isEqual', () => {
  let errorSpy: jest.SpyInstance;

  beforeAll(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    // `warning` is warningOnce: without this, a message emitted by an earlier test is suppressed
    // here, and asserting that nothing warned would prove nothing.
    resetWarned();
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

  const circularWarnings = () =>
    errorSpy.mock.calls.filter(([message]) =>
      String(message).includes('circular references'),
    );

  it('should equal when one side reuses a reference across keys', () => {
    const shared: any[] = [];

    const valueIsEqual = isEqual(
      { errors: shared, warnings: shared },
      { errors: [], warnings: [] },
    );
    expect(valueIsEqual).toBe(true);
    expect(circularWarnings()).toHaveLength(0);
  });

  it('should equal when one side reuses an object across keys', () => {
    const point = { x: 1 };

    const valueIsEqual = isEqual(
      { a: point, b: point },
      { a: { x: 1 }, b: { x: 1 } },
    );
    expect(valueIsEqual).toBe(true);
    expect(circularWarnings()).toHaveLength(0);
  });

  it('should equal when one side reuses a reference inside an array', () => {
    const point = { x: 1 };

    const valueIsEqual = isEqual([point, point], [{ x: 1 }, { x: 1 }]);
    expect(valueIsEqual).toBe(true);
    expect(circularWarnings()).toHaveLength(0);
  });

  it('should still detect a cycle reached through an array', () => {
    const a: any = { list: [] };
    a.list.push(a);
    const b: any = { list: [] };
    b.list.push(b);

    const valueIsEqual = isEqual(a, b);
    expect(valueIsEqual).toBe(false);
    expect(circularWarnings().length).toBeGreaterThan(0);
  });
});
