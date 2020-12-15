import get from '../src/utils/get';
import set from '../src/utils/set';
import pickAttrs from '../src/pickAttrs';

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

  it('set', () => {
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

  it('pickAttrs', () => {
    expect(
      pickAttrs({
        onClick: null,
        checked: true,
        'data-my': 1,
        'aria-this': 2,
        skip: true,
      }),
    ).toEqual({ onClick: null, checked: true, 'data-my': 1, 'aria-this': 2 });

    expect(
      pickAttrs(
        {
          onClick: null,
          checked: true,
          'data-my': 1,
          'aria-this': 2,
          skip: true,
        },
        true,
      ),
    ).toEqual({ 'aria-this': 2 });
  });
});
