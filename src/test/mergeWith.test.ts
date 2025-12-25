import { mergeWith } from '../utils/set';

describe('mergeWith array merge', () => {
  it('should keep existing array length when merging sparse updates', () => {
    const allValues = { list: ['A', 'B', 'C', 'D'] };
    const changedValues = { list: new Array(2) };
    changedValues.list[1] = 'BB'; // 仅更新第 2 项，长度为 2

    const merged = mergeWith([allValues, changedValues], {
      prepareArray: current => [...(current || [])],
    });

    expect(merged.list).toEqual(['A', 'BB', 'C', 'D']);
    expect(merged.list).toHaveLength(4);
  });
});
