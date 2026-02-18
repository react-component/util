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

  it('null', () => {
    const proxyA = proxyObject(null, {
      bamboo: 'little',
    });

    expect(proxyA).toBe(null);
  });

  it('change', () => {
    const div = document.createElement('div');
    div.innerHTML = '<input/>';
    const a = div.firstChild as HTMLInputElement;

    const proxyA = proxyObject(a, {});
    proxyA.value = '321';

    expect(proxyA.value).toBe('321');
  });
});
