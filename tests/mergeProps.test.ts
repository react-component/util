import mergeProps from '../src/mergeProps';

test('merge className', () => {
  expect(
    mergeProps(
      { type: 'default', shape: 'round' },
      { className: 'foo', type: 'secondary' },
      { className: 'bar' },
    ),
  ).toEqual({
    className: 'bar',
    type: 'secondary',
    shape: 'round',
  });
});
