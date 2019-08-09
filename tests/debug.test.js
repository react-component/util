import diff from '../src/debug/diff';

describe('debug', () => {
  describe('diff', () => {
    const base = {
      a: 1,
      b: [2, 3],
      c: {
        d: 4,
      },
    };

    it('same', () => {
      const target = {
        a: 1,
        b: [2, 3],
        c: {
          d: 4,
        },
      };

      expect(diff(base, target)).toEqual([]);
    });

    it('props', () => {
      const target = {
        a: 2,
        b: [3, 4],
        c: {
          d: 5,
        },
      };

      expect(diff(base, target)).toEqual([
        { path: ['a'], value1: 1, value2: 2 },
        { path: ['b', '0'], value1: 2, value2: 3 },
        { path: ['b', '1'], value1: 3, value2: 4 },
        { path: ['c', 'd'], value1: 4, value2: 5 },
      ]);
    });

    it('toString', () => {
      const diffList = diff({ a: 1 }, {});
      expect(diffList.toString()).toEqual(`[
  {
    "path": "a",
    "value1": 1
  }
]`);
    });
  });
});
