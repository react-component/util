import { getFormattedSelection } from '../src';
import type { SelectionRange } from '../src';

const caret = (position: number): SelectionRange => ({
  start: position,
  end: position,
});

describe('getFormattedSelection', () => {
  it.each<[string, string, number, string, number]>([
    ['unchanged text', '12', 1, '12', 1],
    ['an appended suffix', '5', 1, '5%', 1],
    ['an uppercase character typed in the middle', 'AbC', 2, 'ABC', 2],
    ['an uppercase character typed at the end', 'Ab', 2, 'AB', 2],
    ['a prepended prefix', '1', 1, '$ 1', 3],
    ['a prefix and thousands separators', '123456', 3, '$ 123,456', 6],
    ['a removed separator', '12,34', 3, '1,234', 3],
    ['a caret at the start', '1', 0, '$ 1', 0],
    ['an empty origin', '', 0, '$ ', 0],
  ])('keeps the caret with %s', (_, originStr, position, targetStr, result) => {
    expect(
      getFormattedSelection(originStr, caret(position), targetStr),
    ).toEqual(caret(result));
  });

  it('follows the character before the caret when both sides change', () => {
    // `$ ` typed `9` before the prefix, then formatted as `$ 9`.
    expect(getFormattedSelection('9$ ', caret(1), '$ 9')).toEqual(caret(3));
  });

  it('searches for the character before the caret from its previous position', () => {
    // `$` is at index 0, before the search starts at index 1, so it is not found.
    expect(getFormattedSelection('9$ ', caret(2), '$ 9')).toEqual(caret(3));
    // `b` is still at index 1, where the search starts, so it is found.
    expect(getFormattedSelection('abX', caret(2), 'ZbY')).toEqual(caret(2));
  });

  it('moves the caret to the end when the character before it is gone', () => {
    expect(getFormattedSelection('abc', caret(1), 'xyz')).toEqual(caret(3));
  });

  it('adjusts each edge of a selection', () => {
    expect(
      getFormattedSelection('1234', { start: 1, end: 3 }, '1,234'),
    ).toEqual({ start: 1, end: 4 });
  });

  it('does not return a selection that ends before it starts', () => {
    expect(getFormattedSelection('a-b', { start: 1, end: 2 }, 'b-a')).toEqual(
      caret(3),
    );
  });

  it('clamps offsets outside the original text', () => {
    expect(getFormattedSelection('ab', { start: -1, end: 10 }, 'AB')).toEqual({
      start: 0,
      end: 2,
    });
  });

  it('does not modify the selection', () => {
    const selection = Object.freeze(caret(1));
    getFormattedSelection('9$ ', selection, '$ 9');
    expect(selection).toEqual(caret(1));
  });
});
