import mergeProps from '../src/mergeProps';

test('merge className', () => {
  expect(mergeProps({ className: 'foo' }, { className: 'bar' })).toEqual({
    className: 'foo bar',
  });
});

test('merge classNames', () => {
  expect(
    mergeProps(
      {
        classNames: {
          body: 'bam',
          footer: 'foo',
        },
      },
      {
        classNames: {
          footer: 'bar',
          header: 'boo',
        },
      },
    ),
  ).toEqual({
    classNames: {
      body: 'bam',
      footer: 'foo bar',
      header: 'boo',
    },
  });
});

test('merge style', () => {
  expect(
    mergeProps(
      {
        style: {
          background: '#000',
          color: '#666',
        },
      },
      {
        style: {
          background: '#fff',
        },
      },
    ),
  ).toEqual({
    style: {
      background: '#fff',
      color: '#666',
    },
  });
});

test('merge boolean prop', () => {
  expect(
    mergeProps(
      {
        disabled: true,
        loading: false,
      },
      {
        disabled: false,
      },
    ),
  ).toEqual({
    disabled: false,
    loading: false,
  });
});

test('merge number prop', () => {
  expect(
    mergeProps(
      {
        value: 1,
      },
      {
        value: 2,
      },
    ),
  ).toEqual({
    value: 2,
  });
});

test('merge non-plain object prop', () => {
  const dateObj = new Date();
  const urlObj = new URL('https://example.com/');
  expect(
    mergeProps(
      {
        value: dateObj,
      },
      {
        value: urlObj,
      },
    ),
  ).toEqual({
    value: urlObj,
  });
});
