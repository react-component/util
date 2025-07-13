import pick from '../src/pick';

describe('pick', () => {
  it('should work', () => {
    const ret = pick({ a: 1, b: 2, c: 3 }, ['a', 'b']);
    expect(ret).toEqual({ a: 1, b: 2 });
  });

  it('invalidate array', () => {
    const ret = pick({ test: 1 }, null);
    expect(ret).toEqual({});
  });

  it('readonly array', () => {
    const ret = pick({ a: 1, b: 2 }, ['a'] as const);
    expect(ret).toEqual({ a: 1 });
  });
});
