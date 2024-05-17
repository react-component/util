import proxyObject from '../src/proxyObject';

describe('proxyObject', () => {
  it('work', () => {
    const div = document.createElement('div');
    div.innerHTML = '<a>noop</a>';
    const a = div.firstChild as HTMLAnchorElement;

    const proxyA = proxyObject(a, {
      bamboo: 'little',
    });

    expect(proxyA.bamboo).toBe('little');
  });
});
