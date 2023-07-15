import pickAttrs from '../src/pickAttrs';
import get from '../src/utils/get';
import set, { merge } from '../src/utils/set';

describe('utils', () => {
  it('get', () => {
    // Empty path
    expect(get(null, [])).toEqual(null);
    expect(get(undefined, [])).toEqual(undefined);
    expect(get(1, [])).toEqual(1);

    // Part path
    expect(get([1, 2], ['0'])).toEqual(1);
    expect(get([1, 2], ['0', '1'])).toEqual(undefined);
    expect(get({ a: { b: { c: 93 } } }, ['a', 'b'])).toEqual({ c: 93 });
    expect(get({ a: { b: { c: 93 } } }, ['a', 'b', 'c'])).toEqual(93);
    expect(get({ a: { b: { c: 93 } } }, ['a', 'b', 'c', 'd'])).toEqual(
      undefined,
    );
  });

  describe('set', () => {
    it('basic', () => {
      expect(set(null, [], 233)).toEqual(233);
      expect(set({}, ['light'], 'bamboo')).toEqual({ light: 'bamboo' });
      expect(set({}, ['light', 'bamboo'], 'generate')).toEqual({
        light: { bamboo: 'generate' },
      });
      expect(
        set({ other: { next: 233 } }, ['light', 'bamboo'], 'generate'),
      ).toEqual({
        other: { next: 233 },
        light: { bamboo: 'generate' },
      });

      expect(set([0, 1, 2], [1, 'light', 'bamboo'], 'next')).toEqual([
        0,
        { light: { bamboo: 'next' } },
        2,
      ]);
      expect(
        set({ light: 'bamboo', list: [0, 1, 2] }, ['list', '1'], 233),
      ).toEqual({
        light: 'bamboo',
        list: [0, 233, 2],
      });
      expect(set([[[[[0]]]]], [0, 0, 0, 0, 0], 'light')).toEqual([
        [[[['light']]]],
      ]);
      expect(set([[[[[0]]]]], [0, 0, 0, 0, 0, 0], 'bamboo')).toEqual([
        [[[[['bamboo']]]]],
      ]);
    });

    it('remove if undefined', () => {
      // Skip not exist path
      expect(set({}, ['notExist'], undefined, true)).toEqual({});

      // Delete value
      const target = set(
        { keep: { light: 2333 } },
        ['keep', 'light'],
        undefined,
        true,
      );
      expect(target).toEqual({ keep: {} });
      expect('light' in target.keep).toBeFalsy();

      // Mid path not exist
      const midTgt = set(
        { lv1: { lv2: {} } },
        ['lv1', 'lv2', 'lv3'],
        undefined,
        true,
      );
      expect(midTgt).toEqual({ lv1: { lv2: {} } });
      expect('lv3' in midTgt.lv1.lv2).toBeFalsy();

      // Long path not exist
      const longNotExistTgt = set(
        { lv1: { lv2: {} } },
        ['lv1', 'lv2', 'lv3', 'lv4'],
        undefined,
        true,
      );
      expect(longNotExistTgt).toEqual({ lv1: { lv2: {} } });
      expect('lv3' in longNotExistTgt.lv1.lv2).toBeFalsy();

      // Long path remove
      const longTgt = set(
        { lv1: { lv2: { lv3: { lv4: { lv: 5 } } } } },
        ['lv1', 'lv2', 'lv3', 'lv4'],
        undefined,
        true,
      );
      expect(longTgt).toEqual({ lv1: { lv2: { lv3: {} } } });
      expect('lv4' in longTgt.lv1.lv2.lv3).toBeFalsy();
    });

    describe('merge', () => {
      it('basic', () => {
        const merged = merge({}, { a: 1 }, { b: 2 });

        expect(merged).toEqual({
          a: 1,
          b: 2,
        });
      });

      it('array is replacement', () => {
        const merged = merge([], [{ a: 1 }], [{ b: 2 }]);

        expect(merged).toEqual([
          {
            b: 2,
          },
        ]);
      });

      it('array is replacement - sub field', () => {
        const merged = merge({ a: 1, users: [1, 2] }, { users: [] });

        expect(merged).toEqual({ a: 1, users: [] });
      });

      it('not cover', () => {
        const merged = merge(
          {},
          { _: { a: { e: 8 }, b: 2 } },
          { _: { a: { f: 9 }, c: 3 } },
        );

        expect(merged).toEqual({
          _: {
            a: {
              e: 8,
              f: 9,
            },
            b: 2,
            c: 3,
          },
        });
      });

      it('DayObject', () => {
        const now = new Date();

        const merged = merge(
          { a: 123 },
          { b: 234 },
          {
            now,
          },
        );

        expect(merged).toEqual({
          a: 123,
          b: 234,
          now,
        });

        expect(merged.now).toBe(now);
      });

      it('empty object', () => {
        const merged = merge({}, { a: {} });
        expect(merged).toEqual({ a: {} });
      });

      it('no dead-loop', () => {
        const looper = {
          a: 1,
          b: {
            c: 3,
          },
        };
        looper.b.looper = looper;

        const merged = merge(looper);
        expect(merged).toEqual({
          a: 1,
          b: {
            c: 3,
          },
        });
      });

      it('different type', () => {
        const merged = merge({ selector: 'K1' }, { selector: ['K1', 'K2'] });

        expect(merged).toEqual({
          selector: ['K1', 'K2'],
        });
      });

      it('shallow copy', () => {
        const ori = {
          list: [{ a: 1 }, { a: 2 }],
        };

        const cloneList = [...ori.list];
        cloneList[0] = {
          ...cloneList[0],
          b: 3,
        };

        const merged = merge(ori, { list: cloneList });

        expect(merged).toEqual({
          list: [{ a: 1, b: 3 }, { a: 2 }],
        });
      });

      it('skip class object', () => {
        class User {
          constructor(name, age) {
            this.name = name;
            this.age = age;
          }
        }

        const user = new User('little', 2);

        const merged = merge({}, { user }, {});

        expect(merged.user).toBe(user);
      });

      it('ref object', () => {
        const obj = { bamboo: 1 };

        const merged = merge({}, { a: obj, b: obj }, {});

        expect(merged).toEqual({
          a: obj,
          b: obj,
        });
      });

      it('support Symbol', () => {
        const symbol = Symbol();

        const merged = merge({}, { [symbol]: 1 });

        expect(merged).toEqual({
          [symbol]: 1,
        });
      });
    });
  });

  describe('pickAttrs', () => {
    const originProps = {
      onClick: null,
      checked: true,
      'data-my': 1,
      'aria-this': 2,
      skip: true,
      role: 'button',
    };

    it('default', () => {
      expect(pickAttrs(originProps)).toEqual({
        onClick: null,
        checked: true,
        'data-my': 1,
        'aria-this': 2,
        role: 'button',
      });
    });

    it('aria only', () => {
      expect(pickAttrs(originProps, true)).toEqual({
        'aria-this': 2,
        role: 'button',
      });
    });

    it('attr only', () => {
      expect(pickAttrs(originProps, { attr: true })).toEqual({
        onClick: null,
        checked: true,
        role: 'button',
      });
    });

    it('aria & data', () => {
      expect(pickAttrs(originProps, { aria: true, data: true })).toEqual({
        'data-my': 1,
        'aria-this': 2,
        role: 'button',
      });
    });
  });
});
