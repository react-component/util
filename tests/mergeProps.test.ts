import mergeProps from '../src/mergeProps';

describe('mergeProps', () => {
  it('merges two objects with later overriding earlier', () => {
    const a = { foo: 1, bar: 2 };
    const b = { bar: 3, baz: 4 };
    expect(mergeProps(a, b)).toEqual({ foo: 1, bar: 3, baz: 4 });
  });

  it('excludes keys with undefined values', () => {
    const a = { foo: 1, bar: undefined };
    const b = { bar: 2 };
    expect(mergeProps(a, b)).toEqual({ foo: 1, bar: 2 });
  });

  it('does not include key if value is undefined in last object', () => {
    const a = { foo: 1 };
    const b = { bar: undefined };
    expect(mergeProps(a, b)).toEqual({ foo: 1 });
  });

  it('skips null and undefined items', () => {
    const a = { foo: 1 };
    expect(mergeProps(a, null as any)).toEqual({ foo: 1 });
    expect(mergeProps(a, undefined as any)).toEqual({ foo: 1 });
    expect(mergeProps(null as any, a)).toEqual({ foo: 1 });
    expect(mergeProps(undefined as any, a)).toEqual({ foo: 1 });
  });

  it('merges three or more objects with rightmost winning', () => {
    const a = { a: 1 };
    const b = { a: 2, b: 2 };
    const c = { a: 3, b: 3, c: 3 };
    expect(mergeProps(a, b, c)).toEqual({ a: 3, b: 3, c: 3 });
  });

  it('returns empty object for no args', () => {
    expect((mergeProps as (...items: any[]) => any)()).toEqual({});
  });

  it('returns copy of single object', () => {
    const a = { foo: 1, bar: 2 };
    expect((mergeProps as (...items: any[]) => any)(a)).toEqual({
      foo: 1,
      bar: 2,
    });
  });

  it('handles empty objects', () => {
    expect(mergeProps({}, { a: 1 }, {})).toEqual({ a: 1 });
  });

  describe('className', () => {
    it('merges strings', () => {
      const a = { className: 'a' };
      const b = { className: 'b' };
      expect(mergeProps(a, b)).toEqual({ className: 'a b' });
    });

    it('keeps previous when later is undefined', () => {
      expect(mergeProps({ className: 'a' }, { className: undefined })).toEqual({
        className: 'a',
      });
    });

    it('omits key when only undefined', () => {
      expect(
        (mergeProps as (...items: any[]) => any)({ className: undefined }),
      ).toEqual({});
    });

    it('null merges like empty string', () => {
      expect(
        mergeProps({ className: 'a' }, { className: null as any }),
      ).toEqual({ className: 'a' });
      expect(
        mergeProps({ className: null as any }, { className: 'b' }),
      ).toEqual({ className: 'b' });
      expect(
        (mergeProps as (...items: any[]) => any)({ className: null as any }),
      ).toEqual({ className: '' });
    });
  });

  describe('style', () => {
    it('merges objects', () => {
      const a = { style: { color: 'red' } };
      const b = { style: { backgroundColor: 'blue' } };
      expect(mergeProps(a, b)).toEqual({
        style: { color: 'red', backgroundColor: 'blue' },
      });
    });

    it('keeps previous when later is undefined', () => {
      expect(
        mergeProps({ style: { color: 'red' } }, { style: undefined }),
      ).toEqual({ style: { color: 'red' } });
    });

    it('null source does not wipe previous style', () => {
      expect(
        mergeProps({ style: { color: 'red' } }, { style: null as any }),
      ).toEqual({ style: { color: 'red' } });
    });

    it('applies when earlier style is undefined or null', () => {
      expect(
        mergeProps({ style: undefined }, { style: { color: 'red' } }),
      ).toEqual({ style: { color: 'red' } });
      expect(
        mergeProps({ style: null as any }, { style: { color: 'red' } }),
      ).toEqual({ style: { color: 'red' } });
    });

    it('nested properties may be null or undefined', () => {
      expect(
        mergeProps(
          { style: { color: 'red', margin: undefined as any } },
          { style: { padding: null as any, color: 'blue' } },
        ),
      ).toEqual({
        style: {
          color: 'blue',
          margin: undefined,
          padding: null,
        },
      });
    });
  });
});
